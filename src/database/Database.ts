import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Enable verbose mode for debugging
sqlite3.verbose();

export interface DatabaseUser {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  village_id: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseAsset {
  id: string;
  village_id: string;
  asset_type: string;
  name: string;
  latitude?: number;
  longitude?: number;
  installation_date?: string;
  last_maintenance?: string;
  health_score: number;
  status: 'active' | 'maintenance' | 'inactive';
  metadata?: string;
  created_at: string;
}

export interface DatabaseSensorReading {
  id: string;
  asset_id: string;
  sensor_type: string;
  value: number;
  unit: string;
  timestamp: string;
  quality_score: number;
}

export interface DatabaseMaintenancePrediction {
  id: string;
  asset_id: string;
  predicted_failure_date: string;
  failure_type: string;
  confidence_score: number;
  estimated_cost?: number;
  prevention_actions?: string;
  created_at: string;
  is_resolved: boolean;
}

export interface DatabaseCitizenIssue {
  id: string;
  village_id: string;
  reported_by: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'acknowledged' | 'in_progress' | 'resolved';
  latitude?: number;
  longitude?: number;
  photo_urls?: string;
  video_urls?: string;
  upvotes: number;
  created_at: string;
  resolved_at?: string;
}

export interface DatabaseProposal {
  id: string;
  village_id: string;
  title: string;
  description: string;
  category: string;
  budget_amount?: number;
  submitted_by: string;
  voting_deadline: string;
  status: 'active' | 'passed' | 'rejected' | 'expired';
  created_at: string;
}

export interface DatabaseVote {
  id: string;
  proposal_id: string;
  user_id: string;
  vote_type: 'for' | 'against' | 'abstain';
  created_at: string;
}

class Database {
  private static instance: Database;
  private db!: sqlite3.Database;
  private dbPath: string;
  private run!: (sql: string, params?: any[]) => Promise<any>;
  private get!: (sql: string, params?: any[]) => Promise<any>;
  public all!: (sql: string, params?: any[]) => Promise<any[]>;

  private constructor() {
    // Create database directory if it doesn't exist
    const dbDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    this.dbPath = path.join(dbDir, 'village_infrastructure.db');
    this.initializeDatabase();
  }

  private initializeDatabase() {
    this.db = new sqlite3.Database(this.dbPath);
    
    // Promisify database methods
    this.run = promisify(this.db.run.bind(this.db));
    this.get = promisify(this.db.get.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async initialize(): Promise<void> {
    try {
      // Read and execute schema
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Split schema into individual statements
      const statements = schema.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          await this.run(statement);
        }
      }

      console.log('Database initialized successfully');
      
      // Insert sample data if database is empty
      await this.insertSampleData();
      
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async insertSampleData(): Promise<void> {
    try {
      // Check if we already have data
      const userCount = await this.get('SELECT COUNT(*) as count FROM users') as { count: number };
      if (userCount.count > 0) {
        console.log('Sample data already exists');
        return;
      }

      console.log('Inserting sample data...');

      // Insert sample village
      const villageId = uuidv4();
      await this.run(`
        INSERT INTO villages (id, name, state, district, population, area_sq_km, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [villageId, 'Sudarshan Village', 'Maharashtra', 'Pune', 3810, 12.5, 18.5204, 73.8567]);

      // Insert sample users
      const adminId = uuidv4();
      const userId = uuidv4();
      const adminPasswordHash = await bcrypt.hash('admin123', 10);
      const userPasswordHash = await bcrypt.hash('user123', 10);

      await this.run(`
        INSERT INTO users (id, full_name, email, password_hash, role, village_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [adminId, 'Village Administrator', 'admin@village.gov.in', adminPasswordHash, 'admin', villageId]);

      await this.run(`
        INSERT INTO users (id, full_name, email, password_hash, role, village_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [userId, 'Rajesh Kumar', 'rajesh@village.com', userPasswordHash, 'user', villageId]);

      // Insert sample assets
      const assets = [
        {
          id: uuidv4(),
          name: 'Main Water Pump',
          type: 'water_pump',
          lat: 18.5204,
          lng: 73.8567,
          health: 85
        },
        {
          id: uuidv4(),
          name: 'Solar Panel Array A',
          type: 'solar_panel',
          lat: 18.5214,
          lng: 73.8577,
          health: 92
        },
        {
          id: uuidv4(),
          name: 'Street Light Circuit 1',
          type: 'street_light',
          lat: 18.5194,
          lng: 73.8557,
          health: 78
        }
      ];

      for (const asset of assets) {
        await this.run(`
          INSERT INTO infrastructure_assets (id, village_id, asset_type, name, latitude, longitude, health_score, installation_date, last_maintenance)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [asset.id, villageId, asset.type, asset.name, asset.lat, asset.lng, asset.health, '2023-01-15', '2024-12-01']);

        // Insert sample sensor readings
        const sensorTypes = asset.type === 'water_pump' ? ['vibration', 'temperature', 'pressure'] :
                           asset.type === 'solar_panel' ? ['voltage', 'current', 'temperature'] :
                           ['current', 'voltage'];

        for (const sensorType of sensorTypes) {
          for (let i = 0; i < 10; i++) {
            const readingId = uuidv4();
            const timestamp = new Date(Date.now() - i * 3600000).toISOString(); // Last 10 hours
            const value = Math.random() * 100 + 50; // Random value between 50-150
            const unit = sensorType === 'temperature' ? '°C' : 
                        sensorType === 'voltage' ? 'V' : 
                        sensorType === 'current' ? 'A' : 
                        sensorType === 'pressure' ? 'PSI' : 'Hz';

            await this.run(`
              INSERT INTO sensor_readings (id, asset_id, sensor_type, value, unit, timestamp, quality_score)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [readingId, asset.id, sensorType, value, unit, timestamp, 0.95]);
          }
        }

        // Insert sample maintenance prediction
        if (asset.health < 90) {
          const predictionId = uuidv4();
          const failureDate = new Date(Date.now() + Math.random() * 30 * 24 * 3600000).toISOString().split('T')[0]; // Next 30 days
          await this.run(`
            INSERT INTO maintenance_predictions (id, asset_id, predicted_failure_date, failure_type, confidence_score, estimated_cost, prevention_actions)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [predictionId, asset.id, failureDate, 'Component wear', 0.75, 15000, JSON.stringify(['Lubricate bearings', 'Replace filters', 'Check electrical connections'])]);
        }
      }

      // Insert sample citizen issues
      const issues = [
        {
          title: 'Water supply disruption in Sector A',
          description: 'No water supply for the past 2 days in Sector A residential area',
          category: 'water',
          priority: 'high'
        },
        {
          title: 'Street light not working',
          description: 'Street light near community center has been flickering and now completely off',
          category: 'electricity',
          priority: 'medium'
        }
      ];

      for (const issue of issues) {
        const issueId = uuidv4();
        await this.run(`
          INSERT INTO citizen_issues (id, village_id, reported_by, title, description, category, priority, upvotes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [issueId, villageId, userId, issue.title, issue.description, issue.category, issue.priority, Math.floor(Math.random() * 20)]);
      }

      // Insert sample proposals
      const proposals = [
        {
          title: 'Install new solar panels',
          description: 'Proposal to install additional solar panels to increase renewable energy capacity',
          category: 'infrastructure',
          budget: 500000
        },
        {
          title: 'Upgrade water treatment facility',
          description: 'Modernize the water treatment plant with new filtration technology',
          category: 'water',
          budget: 750000
        }
      ];

      for (const proposal of proposals) {
        const proposalId = uuidv4();
        const deadline = new Date(Date.now() + 7 * 24 * 3600000).toISOString(); // 7 days from now
        await this.run(`
          INSERT INTO proposals (id, village_id, title, description, category, budget_amount, submitted_by, voting_deadline)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [proposalId, villageId, proposal.title, proposal.description, proposal.category, proposal.budget, adminId, deadline]);

        // Insert sample votes
        const voteId = uuidv4();
        await this.run(`
          INSERT INTO votes (id, proposal_id, user_id, vote_type)
          VALUES (?, ?, ?, ?)
        `, [voteId, proposalId, userId, 'for']);
      }

      // Insert sample blockchain transactions
      const transactions = [
        {
          type: 'budget_allocation',
          amount: 100000,
          description: 'Monthly infrastructure maintenance budget',
          blockHash: '0x' + Math.random().toString(16).substr(2, 64),
          txHash: '0x' + Math.random().toString(16).substr(2, 64)
        },
        {
          type: 'payment',
          amount: 25000,
          description: 'Payment to contractor for road repair',
          blockHash: '0x' + Math.random().toString(16).substr(2, 64),
          txHash: '0x' + Math.random().toString(16).substr(2, 64)
        }
      ];

      for (const tx of transactions) {
        const txId = uuidv4();
        await this.run(`
          INSERT INTO blockchain_transactions (id, village_id, transaction_type, amount, description, block_hash, transaction_hash, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [txId, villageId, tx.type, tx.amount, tx.description, tx.blockHash, tx.txHash, 'confirmed']);
      }

      // Insert sample sustainability metrics
      const metrics = [
        { type: 'carbon_footprint', value: 125.5, unit: 'tons CO2' },
        { type: 'energy_consumption', value: 2500, unit: 'kWh' },
        { type: 'renewable_energy', value: 1800, unit: 'kWh' },
        { type: 'waste_generated', value: 450, unit: 'kg' }
      ];

      for (const metric of metrics) {
        const metricId = uuidv4();
        const measurementDate = new Date().toISOString().split('T')[0];
        await this.run(`
          INSERT INTO sustainability_metrics (id, village_id, metric_type, value, unit, measurement_date, source)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [metricId, villageId, metric.type, metric.value, metric.unit, measurementDate, 'automated_sensor']);
      }

      console.log('Sample data inserted successfully');
      
    } catch (error) {
      console.error('Failed to insert sample data:', error);
      throw error;
    }
  }

  // User operations
  public async createUser(userData: Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const id = uuidv4();
    await this.run(`
      INSERT INTO users (id, full_name, email, password_hash, role, village_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, userData.full_name, userData.email, userData.password_hash, userData.role, userData.village_id]);
    return id;
  }

  public async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const user = await this.get('SELECT * FROM users WHERE email = ?', [email]);
    return user || null;
  }

  public async getUserById(id: string): Promise<DatabaseUser | null> {
    const user = await this.get('SELECT * FROM users WHERE id = ?', [id]);
    return user || null;
  }

  public async getVillages(): Promise<any[]> {
    return await this.all('SELECT * FROM villages ORDER BY created_at DESC');
  }

  // Asset operations
  public async getAssetsByVillage(villageId: string): Promise<DatabaseAsset[]> {
    return await this.all('SELECT * FROM infrastructure_assets WHERE village_id = ? ORDER BY created_at DESC', [villageId]);
  }

  public async getAssetById(id: string): Promise<DatabaseAsset | null> {
    const asset = await this.get('SELECT * FROM infrastructure_assets WHERE id = ?', [id]);
    return asset || null;
  }

  public async updateAssetHealth(id: string, healthScore: number): Promise<void> {
    await this.run('UPDATE infrastructure_assets SET health_score = ? WHERE id = ?', [healthScore, id]);
  }

  // Sensor readings
  public async addSensorReading(reading: Omit<DatabaseSensorReading, 'id' | 'timestamp'>): Promise<string> {
    const id = uuidv4();
    await this.run(`
      INSERT INTO sensor_readings (id, asset_id, sensor_type, value, unit, quality_score)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, reading.asset_id, reading.sensor_type, reading.value, reading.unit, reading.quality_score]);
    return id;
  }

  public async getSensorReadings(assetId: string, limit: number = 100): Promise<DatabaseSensorReading[]> {
    return await this.all(`
      SELECT * FROM sensor_readings 
      WHERE asset_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `, [assetId, limit]);
  }

  // Maintenance predictions
  public async getMaintenancePredictions(assetId?: string): Promise<DatabaseMaintenancePrediction[]> {
    if (assetId) {
      return await this.all('SELECT * FROM maintenance_predictions WHERE asset_id = ? AND is_resolved = FALSE ORDER BY predicted_failure_date ASC', [assetId]);
    }
    return await this.all('SELECT * FROM maintenance_predictions WHERE is_resolved = FALSE ORDER BY predicted_failure_date ASC');
  }

  public async markPredictionResolved(id: string): Promise<void> {
    await this.run('UPDATE maintenance_predictions SET is_resolved = TRUE WHERE id = ?', [id]);
  }

  // Citizen issues
  public async getCitizenIssues(villageId: string): Promise<DatabaseCitizenIssue[]> {
    return await this.all('SELECT * FROM citizen_issues WHERE village_id = ? ORDER BY created_at DESC', [villageId]);
  }

  public async createCitizenIssue(issue: Omit<DatabaseCitizenIssue, 'id' | 'created_at' | 'upvotes'>): Promise<string> {
    const id = uuidv4();
    await this.run(`
      INSERT INTO citizen_issues (id, village_id, reported_by, title, description, category, priority, status, latitude, longitude, photo_urls, video_urls)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, issue.village_id, issue.reported_by, issue.title, issue.description, issue.category, issue.priority, issue.status, issue.latitude, issue.longitude, issue.photo_urls, issue.video_urls]);
    return id;
  }

  public async upvoteIssue(id: string): Promise<void> {
    await this.run('UPDATE citizen_issues SET upvotes = upvotes + 1 WHERE id = ?', [id]);
  }

  // Proposals and voting
  public async getProposals(villageId: string): Promise<DatabaseProposal[]> {
    return await this.all('SELECT * FROM proposals WHERE village_id = ? ORDER BY created_at DESC', [villageId]);
  }

  public async submitVote(proposalId: string, userId: string, voteType: 'for' | 'against' | 'abstain'): Promise<string> {
    const id = uuidv4();
    await this.run(`
      INSERT OR REPLACE INTO votes (id, proposal_id, user_id, vote_type)
      VALUES (?, ?, ?, ?)
    `, [id, proposalId, userId, voteType]);
    return id;
  }

  public async getVoteResults(proposalId: string): Promise<{ for: number; against: number; abstain: number }> {
    const results = await this.all(`
      SELECT vote_type, COUNT(*) as count 
      FROM votes 
      WHERE proposal_id = ? 
      GROUP BY vote_type
    `, [proposalId]);

    const voteCount = { for: 0, against: 0, abstain: 0 };
    results.forEach((result: any) => {
      voteCount[result.vote_type as keyof typeof voteCount] = result.count;
    });

    return voteCount;
  }

  // Blockchain transactions
  public async getBlockchainTransactions(villageId: string): Promise<any[]> {
    return await this.all('SELECT * FROM blockchain_transactions WHERE village_id = ? ORDER BY created_at DESC', [villageId]);
  }

  // Sustainability metrics
  public async getSustainabilityMetrics(villageId: string, metricType?: string): Promise<any[]> {
    if (metricType) {
      return await this.all('SELECT * FROM sustainability_metrics WHERE village_id = ? AND metric_type = ? ORDER BY measurement_date DESC', [villageId, metricType]);
    }
    return await this.all('SELECT * FROM sustainability_metrics WHERE village_id = ? ORDER BY measurement_date DESC', [villageId]);
  }

  // Voice commands
  public async saveVoiceCommand(userId: string, command: string, language: string, response: string, confidence: number): Promise<string> {
    const id = uuidv4();
    await this.run(`
      INSERT INTO voice_commands (id, user_id, command, language, response, confidence_score)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, userId, command, language, response, confidence]);
    return id;
  }

  public async getVoiceCommands(userId: string, limit: number = 10): Promise<any[]> {
    return await this.all('SELECT * FROM voice_commands WHERE user_id = ? ORDER BY created_at DESC LIMIT ?', [userId, limit]);
  }

  // Close database connection
  public close(): void {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

export default Database;
