# Real Data Integration Guide

## Overview
This guide explains how to transform the demo village infrastructure digital twin into a production system with real data sources.

## 1. Database Architecture

### Primary Database (PostgreSQL)
```sql
-- Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user')),
    village_id UUID REFERENCES villages(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Villages
CREATE TABLE villages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    population INTEGER,
    area_sq_km DECIMAL(10,2),
    coordinates POINT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Infrastructure Assets
CREATE TABLE infrastructure_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id UUID REFERENCES villages(id),
    asset_type VARCHAR(100) NOT NULL, -- 'water_pump', 'solar_panel', 'street_light', etc.
    name VARCHAR(255) NOT NULL,
    location POINT,
    installation_date DATE,
    last_maintenance DATE,
    health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
    status VARCHAR(50) DEFAULT 'active',
    metadata JSONB, -- Additional asset-specific data
    created_at TIMESTAMP DEFAULT NOW()
);

-- IoT Sensor Data
CREATE TABLE sensor_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES infrastructure_assets(id),
    sensor_type VARCHAR(100) NOT NULL, -- 'vibration', 'temperature', 'current', 'voltage'
    value DECIMAL(15,6) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    quality_score DECIMAL(3,2) DEFAULT 1.0 -- Data quality indicator
);

-- Predictive Maintenance
CREATE TABLE maintenance_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES infrastructure_assets(id),
    predicted_failure_date DATE NOT NULL,
    failure_type VARCHAR(255) NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL,
    estimated_cost DECIMAL(12,2),
    prevention_actions TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    is_resolved BOOLEAN DEFAULT FALSE
);

-- Citizen Issues
CREATE TABLE citizen_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id UUID REFERENCES villages(id),
    reported_by UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'reported',
    location POINT,
    photo_urls TEXT[],
    video_urls TEXT[],
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- Community Voting
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id UUID REFERENCES villages(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    budget_amount DECIMAL(15,2),
    submitted_by UUID REFERENCES users(id),
    voting_deadline TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id),
    user_id UUID REFERENCES users(id),
    vote_type VARCHAR(20) NOT NULL CHECK (vote_type IN ('for', 'against', 'abstain')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(proposal_id, user_id)
);

-- Blockchain Transactions
CREATE TABLE blockchain_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id UUID REFERENCES villages(id),
    transaction_type VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2),
    description TEXT NOT NULL,
    block_hash VARCHAR(255) NOT NULL,
    transaction_hash VARCHAR(255) NOT NULL,
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sustainability Metrics
CREATE TABLE sustainability_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id UUID REFERENCES villages(id),
    metric_type VARCHAR(100) NOT NULL, -- 'carbon_footprint', 'energy_consumption', 'waste_generated'
    value DECIMAL(15,6) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    measurement_date DATE NOT NULL,
    source VARCHAR(255), -- Data source identifier
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Time-Series Database (InfluxDB for IoT Data)
```sql
-- Sensor data with high frequency
CREATE MEASUREMENT sensor_data
TAGS:
  - asset_id
  - sensor_type
  - village_id
FIELDS:
  - value (float)
  - quality_score (float)
TIME: timestamp
```

## 2. API Architecture

### Backend API Structure (Node.js/Express + TypeScript)

```typescript
// src/types/index.ts
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'user';
  villageId: string;
  createdAt: Date;
}

export interface Asset {
  id: string;
  villageId: string;
  assetType: string;
  name: string;
  location: { lat: number; lng: number };
  healthScore: number;
  status: string;
  lastMaintenance: Date;
}

export interface SensorReading {
  id: string;
  assetId: string;
  sensorType: string;
  value: number;
  unit: string;
  timestamp: Date;
  qualityScore: number;
}
```

### API Endpoints

```typescript
// src/routes/assets.ts
import express from 'express';
import { AssetService } from '../services/AssetService';

const router = express.Router();

// Get all assets for a village
router.get('/village/:villageId', async (req, res) => {
  try {
    const assets = await AssetService.getAssetsByVillage(req.params.villageId);
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get asset health predictions
router.get('/:assetId/predictions', async (req, res) => {
  try {
    const predictions = await AssetService.getMaintenancePredictions(req.params.assetId);
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update asset health score
router.put('/:assetId/health', async (req, res) => {
  try {
    const { healthScore } = req.body;
    await AssetService.updateHealthScore(req.params.assetId, healthScore);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 3. IoT Integration

### MQTT Broker Setup (Mosquitto)
```bash
# Install Mosquitto MQTT Broker
sudo apt-get install mosquitto mosquitto-clients

# Configure authentication
sudo mosquitto_passwd -c /etc/mosquitto/passwd village_iot
```

### IoT Device Integration
```typescript
// src/services/IoTService.ts
import mqtt from 'mqtt';
import { InfluxDB } from '@influxdata/influxdb-client';

export class IoTService {
  private mqttClient: mqtt.MqttClient;
  private influxDB: InfluxDB;

  constructor() {
    this.mqttClient = mqtt.connect('mqtt://localhost:1883', {
      username: 'village_iot',
      password: process.env.MQTT_PASSWORD
    });
    
    this.influxDB = new InfluxDB({
      url: process.env.INFLUX_URL,
      token: process.env.INFLUX_TOKEN
    });

    this.setupMQTTListeners();
  }

  private setupMQTTListeners() {
    // Subscribe to sensor data topics
    this.mqttClient.subscribe('village/+/sensors/+/data');
    
    this.mqttClient.on('message', async (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        await this.processSensorData(topic, data);
      } catch (error) {
        console.error('Error processing MQTT message:', error);
      }
    });
  }

  private async processSensorData(topic: string, data: any) {
    const [, villageId, , assetId, ] = topic.split('/');
    
    // Store in InfluxDB for time-series analysis
    const writeApi = this.influxDB.getWriteApi('village_org', 'sensor_data');
    
    const point = {
      measurement: 'sensor_readings',
      tags: {
        village_id: villageId,
        asset_id: assetId,
        sensor_type: data.sensorType
      },
      fields: {
        value: data.value,
        quality_score: data.qualityScore || 1.0
      },
      timestamp: new Date(data.timestamp)
    };
    
    writeApi.writePoint(point);
    await writeApi.close();

    // Trigger predictive maintenance analysis
    await this.triggerPredictiveAnalysis(assetId, data);
  }

  private async triggerPredictiveAnalysis(assetId: string, data: any) {
    // Call ML service for predictive maintenance
    // This would integrate with your AI/ML pipeline
  }
}
```

## 4. Machine Learning Pipeline

### Predictive Maintenance Model
```python
# ml_services/predictive_maintenance.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
from datetime import datetime, timedelta

class PredictiveMaintenanceModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        
    def train_model(self, sensor_data, maintenance_history):
        """Train the predictive maintenance model"""
        # Feature engineering
        features = self.create_features(sensor_data)
        
        # Create target variable (days until next maintenance)
        targets = self.create_targets(maintenance_history)
        
        # Scale features
        features_scaled = self.scaler.fit_transform(features)
        
        # Train model
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(features_scaled, targets)
        
        # Save model
        joblib.dump(self.model, 'models/predictive_maintenance.pkl')
        joblib.dump(self.scaler, 'models/scaler.pkl')
    
    def predict_failure(self, asset_id, recent_sensor_data):
        """Predict when an asset might fail"""
        if not self.model:
            self.load_model()
            
        features = self.create_features(recent_sensor_data)
        features_scaled = self.scaler.transform(features)
        
        days_until_failure = self.model.predict(features_scaled)[0]
        confidence = self.model.score(features_scaled, [days_until_failure])
        
        predicted_date = datetime.now() + timedelta(days=days_until_failure)
        
        return {
            'asset_id': asset_id,
            'predicted_failure_date': predicted_date,
            'confidence_score': confidence,
            'days_until_failure': days_until_failure
        }
    
    def create_features(self, sensor_data):
        """Create features from sensor data"""
        df = pd.DataFrame(sensor_data)
        
        features = []
        # Rolling averages
        features.append(df['value'].rolling(24).mean().iloc[-1])  # 24-hour average
        features.append(df['value'].rolling(168).mean().iloc[-1])  # 7-day average
        
        # Trend analysis
        features.append(df['value'].diff().mean())  # Average change rate
        
        # Anomaly detection
        features.append(len(df[df['value'] > df['value'].quantile(0.95)]))  # High value count
        
        return np.array(features).reshape(1, -1)
```

### API Integration for ML Predictions
```typescript
// src/services/MLService.ts
import axios from 'axios';

export class MLService {
  private static ML_API_URL = process.env.ML_API_URL || 'http://localhost:5000';

  static async getPredictiveMaintenance(assetId: string): Promise<any> {
    try {
      const response = await axios.post(`${this.ML_API_URL}/predict/maintenance`, {
        asset_id: assetId
      });
      return response.data;
    } catch (error) {
      console.error('ML Service error:', error);
      throw new Error('Failed to get maintenance prediction');
    }
  }

  static async analyzeSustainability(villageId: string): Promise<any> {
    try {
      const response = await axios.post(`${this.ML_API_URL}/analyze/sustainability`, {
        village_id: villageId
      });
      return response.data;
    } catch (error) {
      console.error('ML Service error:', error);
      throw new Error('Failed to analyze sustainability metrics');
    }
  }
}
```

## 5. Blockchain Integration

### Smart Contract (Solidity)
```solidity
// contracts/VillageGovernance.sol
pragma solidity ^0.8.0;

contract VillageGovernance {
    struct Transaction {
        uint256 id;
        string description;
        uint256 amount;
        address recipient;
        bool executed;
        uint256 timestamp;
    }
    
    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 budget;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
    }
    
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => bool) public authorizedUsers;
    
    event TransactionCreated(uint256 indexed id, string description, uint256 amount);
    event ProposalCreated(uint256 indexed id, string title, uint256 budget);
    event VoteCast(uint256 indexed proposalId, address voter, bool support);
    
    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender], "Not authorized");
        _;
    }
    
    function createTransaction(
        string memory description,
        uint256 amount,
        address recipient
    ) public onlyAuthorized returns (uint256) {
        uint256 transactionId = block.timestamp;
        
        transactions[transactionId] = Transaction({
            id: transactionId,
            description: description,
            amount: amount,
            recipient: recipient,
            executed: false,
            timestamp: block.timestamp
        });
        
        emit TransactionCreated(transactionId, description, amount);
        return transactionId;
    }
    
    function vote(uint256 proposalId, bool support) public {
        require(proposals[proposalId].deadline > block.timestamp, "Voting ended");
        
        if (support) {
            proposals[proposalId].votesFor++;
        } else {
            proposals[proposalId].votesAgainst++;
        }
        
        emit VoteCast(proposalId, msg.sender, support);
    }
}
```

### Blockchain Service Integration
```typescript
// src/services/BlockchainService.ts
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

export class BlockchainService {
  private web3: Web3;
  private contract: Contract;

  constructor() {
    this.web3 = new Web3(process.env.ETHEREUM_RPC_URL);
    this.contract = new this.web3.eth.Contract(
      JSON.parse(process.env.CONTRACT_ABI),
      process.env.CONTRACT_ADDRESS
    );
  }

  async createTransaction(description: string, amount: number, recipient: string) {
    try {
      const accounts = await this.web3.eth.getAccounts();
      const result = await this.contract.methods
        .createTransaction(description, amount, recipient)
        .send({ from: accounts[0] });
      
      return {
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber
      };
    } catch (error) {
      console.error('Blockchain transaction error:', error);
      throw error;
    }
  }

  async getTransactionHistory(villageId: string) {
    // Query blockchain for transaction history
    const events = await this.contract.getPastEvents('TransactionCreated', {
      fromBlock: 0,
      toBlock: 'latest'
    });
    
    return events.map(event => ({
      id: event.returnValues.id,
      description: event.returnValues.description,
      amount: event.returnValues.amount,
      blockHash: event.blockHash,
      timestamp: new Date(event.returnValues.timestamp * 1000)
    }));
  }
}
```

## 6. Frontend Data Integration

### API Service Layer
```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
  private static instance: ApiService;
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // Add auth token to requests
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Asset Management
  async getAssets(villageId: string) {
    const response = await this.axiosInstance.get(`/assets/village/${villageId}`);
    return response.data;
  }

  async getMaintenancePredictions(assetId: string) {
    const response = await this.axiosInstance.get(`/assets/${assetId}/predictions`);
    return response.data;
  }

  // Citizen Issues
  async reportIssue(issueData: any) {
    const response = await this.axiosInstance.post('/issues', issueData);
    return response.data;
  }

  async getIssues(villageId: string) {
    const response = await this.axiosInstance.get(`/issues/village/${villageId}`);
    return response.data;
  }

  // Voting
  async getProposals(villageId: string) {
    const response = await this.axiosInstance.get(`/proposals/village/${villageId}`);
    return response.data;
  }

  async submitVote(proposalId: string, voteType: 'for' | 'against' | 'abstain') {
    const response = await this.axiosInstance.post(`/proposals/${proposalId}/vote`, {
      voteType
    });
    return response.data;
  }

  // Blockchain
  async getTransactionHistory(villageId: string) {
    const response = await this.axiosInstance.get(`/blockchain/transactions/${villageId}`);
    return response.data;
  }

  // Sustainability
  async getSustainabilityMetrics(villageId: string) {
    const response = await this.axiosInstance.get(`/sustainability/village/${villageId}`);
    return response.data;
  }
}

export default ApiService.getInstance();
```

### Real-time Data with WebSockets
```typescript
// src/hooks/useRealTimeData.ts
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export const useRealTimeData = (villageId: string) => {
  const [sensorData, setSensorData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_WEBSOCKET_URL);

    socket.emit('join_village', villageId);

    socket.on('sensor_update', (data) => {
      setSensorData(prev => [data, ...prev.slice(0, 99)]); // Keep last 100 readings
    });

    socket.on('maintenance_alert', (alert) => {
      setAlerts(prev => [alert, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [villageId]);

  return { sensorData, alerts };
};
```

## 7. Deployment Architecture

### Docker Compose Setup
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: village_db
      POSTGRES_USER: village_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  influxdb:
    image: influxdb:2.0
    environment:
      INFLUXDB_DB: sensor_data
      INFLUXDB_ADMIN_USER: admin
      INFLUXDB_ADMIN_PASSWORD: ${INFLUX_PASSWORD}
    volumes:
      - influx_data:/var/lib/influxdb2
    ports:
      - "8086:8086"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  mosquitto:
    image: eclipse-mosquitto:2
    volumes:
      - ./mosquitto.conf:/mosquitto/config/mosquitto.conf
    ports:
      - "1883:1883"
      - "9001:9001"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://village_user:${DB_PASSWORD}@postgres:5432/village_db
      REDIS_URL: redis://redis:6379
      MQTT_URL: mqtt://mosquitto:1883
    depends_on:
      - postgres
      - redis
      - mosquitto
    ports:
      - "3000:3000"

  frontend:
    build: ./frontend
    environment:
      REACT_APP_API_URL: http://localhost:3000/api
      REACT_APP_WEBSOCKET_URL: http://localhost:3000
    ports:
      - "3001:3000"

  ml_service:
    build: ./ml_services
    environment:
      DATABASE_URL: postgresql://village_user:${DB_PASSWORD}@postgres:5432/village_db
      INFLUX_URL: http://influxdb:8086
    depends_on:
      - postgres
      - influxdb
    ports:
      - "5000:5000"

volumes:
  postgres_data:
  influx_data:
```

## 8. Data Migration Strategy

### From Demo to Production
```typescript
// scripts/migrate-to-production.ts
import { ApiService } from '../src/services/api';

class DataMigration {
  async migrateUsers() {
    // Create real user accounts
    const users = [
      { fullName: 'Village Administrator', email: 'admin@village.gov.in', role: 'admin' },
      // Add real users
    ];

    for (const user of users) {
      await ApiService.createUser(user);
    }
  }

  async setupIoTDevices() {
    // Register real IoT devices
    const devices = [
      { assetId: 'water-pump-001', sensorTypes: ['vibration', 'temperature', 'current'] },
      { assetId: 'solar-panel-001', sensorTypes: ['voltage', 'current', 'temperature'] },
      // Add real devices
    ];

    for (const device of devices) {
      await ApiService.registerIoTDevice(device);
    }
  }

  async importHistoricalData() {
    // Import existing maintenance records, budget data, etc.
    // This would read from CSV files or existing systems
  }
}
```

## 9. Security Considerations

### Authentication & Authorization
```typescript
// src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(userId: string, role: string): string {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }
}
```

## 10. Monitoring & Logging

### Application Monitoring
```typescript
// src/middleware/monitoring.ts
import winston from 'winston';
import { Request, Response, NextFunction } from 'express';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
};
```

This comprehensive guide shows how to transform your demo system into a production-ready village infrastructure digital twin with real data integration across all modules.
