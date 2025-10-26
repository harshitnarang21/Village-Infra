import axios from 'axios';

// Types for real data structures
export interface RealUser {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'user';
  villageId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RealAsset {
  id: string;
  villageId: string;
  assetType: 'water_pump' | 'solar_panel' | 'street_light' | 'waste_system';
  name: string;
  location: { lat: number; lng: number };
  installationDate: string;
  lastMaintenance: string;
  healthScore: number;
  status: 'active' | 'maintenance' | 'inactive';
  metadata: Record<string, any>;
}

export interface RealSensorReading {
  id: string;
  assetId: string;
  sensorType: 'vibration' | 'temperature' | 'current' | 'voltage' | 'pressure';
  value: number;
  unit: string;
  timestamp: string;
  qualityScore: number;
}

export interface RealMaintenancePrediction {
  id: string;
  assetId: string;
  predictedFailureDate: string;
  failureType: string;
  confidenceScore: number;
  estimatedCost: number;
  preventionActions: string[];
  isResolved: boolean;
}

export interface RealCitizenIssue {
  id: string;
  villageId: string;
  reportedBy: string;
  title: string;
  description: string;
  category: 'water' | 'electricity' | 'roads' | 'waste' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'acknowledged' | 'in_progress' | 'resolved';
  location: { lat: number; lng: number };
  photoUrls: string[];
  videoUrls: string[];
  upvotes: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface RealProposal {
  id: string;
  villageId: string;
  title: string;
  description: string;
  category: string;
  budgetAmount: number;
  submittedBy: string;
  votingDeadline: string;
  status: 'active' | 'passed' | 'rejected' | 'expired';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  createdAt: string;
}

export interface RealBlockchainTransaction {
  id: string;
  villageId: string;
  transactionType: 'budget_allocation' | 'payment' | 'work_order' | 'audit';
  amount: number;
  description: string;
  blockHash: string;
  transactionHash: string;
  fromAddress: string;
  toAddress: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: string;
}

export interface RealSustainabilityMetric {
  id: string;
  villageId: string;
  metricType: 'carbon_footprint' | 'energy_consumption' | 'waste_generated' | 'water_usage';
  value: number;
  unit: string;
  measurementDate: string;
  source: string;
  createdAt: string;
}

class ApiService {
  private static instance: ApiService;
  private axiosInstance: any;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private setupInterceptors() {
    // Request interceptor for auth token
    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(email: string, password: string, role: string, fullName: string): Promise<{ user: RealUser; token: string }> {
    const response = await this.axiosInstance.post('/auth/login', {
      email,
      password,
      role,
      fullName
    });
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  }

  async logout(): Promise<void> {
    await this.axiosInstance.post('/auth/logout');
    localStorage.removeItem('authToken');
  }

  // Asset Management
  async getAssets(villageId: string): Promise<RealAsset[]> {
    const response = await this.axiosInstance.get(`/assets/village/${villageId}`);
    return response.data;
  }

  async getAssetById(assetId: string): Promise<RealAsset> {
    const response = await this.axiosInstance.get(`/assets/${assetId}`);
    return response.data;
  }

  async updateAssetHealth(assetId: string, healthScore: number): Promise<void> {
    await this.axiosInstance.put(`/assets/${assetId}/health`, { healthScore });
  }

  async getAssetSensorData(assetId: string, timeRange?: string): Promise<RealSensorReading[]> {
    const params = timeRange ? { timeRange } : {};
    const response = await this.axiosInstance.get(`/assets/${assetId}/sensors`, { params });
    return response.data;
  }

  // Predictive Maintenance
  async getMaintenancePredictions(assetId?: string): Promise<RealMaintenancePrediction[]> {
    const url = assetId ? `/maintenance/predictions/${assetId}` : '/maintenance/predictions';
    const response = await this.axiosInstance.get(url);
    return response.data;
  }

  async markPredictionResolved(predictionId: string): Promise<void> {
    await this.axiosInstance.put(`/maintenance/predictions/${predictionId}/resolve`);
  }

  // Citizen Issues
  async getCitizenIssues(villageId: string): Promise<RealCitizenIssue[]> {
    const response = await this.axiosInstance.get(`/issues/village/${villageId}`);
    return response.data;
  }

  async reportIssue(issueData: Partial<RealCitizenIssue>): Promise<RealCitizenIssue> {
    const response = await this.axiosInstance.post('/issues', issueData);
    return response.data;
  }

  async updateIssueStatus(issueId: string, status: string): Promise<void> {
    await this.axiosInstance.put(`/issues/${issueId}/status`, { status });
  }

  async upvoteIssue(issueId: string): Promise<void> {
    await this.axiosInstance.post(`/issues/${issueId}/upvote`);
  }

  async uploadIssueMedia(issueId: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    const response = await this.axiosInstance.post(`/issues/${issueId}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.urls;
  }

  // Community Voting
  async getProposals(villageId: string): Promise<RealProposal[]> {
    const response = await this.axiosInstance.get(`/proposals/village/${villageId}`);
    return response.data;
  }

  async createProposal(proposalData: Partial<RealProposal>): Promise<RealProposal> {
    const response = await this.axiosInstance.post('/proposals', proposalData);
    return response.data;
  }

  async submitVote(proposalId: string, voteType: 'for' | 'against' | 'abstain'): Promise<void> {
    await this.axiosInstance.post(`/proposals/${proposalId}/vote`, { voteType });
  }

  async getVoteResults(proposalId: string): Promise<{ for: number; against: number; abstain: number }> {
    const response = await this.axiosInstance.get(`/proposals/${proposalId}/results`);
    return response.data;
  }

  // Blockchain Transparency
  async getBlockchainTransactions(villageId: string): Promise<RealBlockchainTransaction[]> {
    const response = await this.axiosInstance.get(`/blockchain/transactions/${villageId}`);
    return response.data;
  }

  async createBlockchainTransaction(transactionData: Partial<RealBlockchainTransaction>): Promise<RealBlockchainTransaction> {
    const response = await this.axiosInstance.post('/blockchain/transactions', transactionData);
    return response.data;
  }

  async getTransactionDetails(transactionId: string): Promise<RealBlockchainTransaction> {
    const response = await this.axiosInstance.get(`/blockchain/transactions/details/${transactionId}`);
    return response.data;
  }

  // Sustainability Metrics
  async getSustainabilityMetrics(villageId: string, metricType?: string): Promise<RealSustainabilityMetric[]> {
    const params = metricType ? { metricType } : {};
    const response = await this.axiosInstance.get(`/sustainability/village/${villageId}`, { params });
    return response.data;
  }

  async recordSustainabilityMetric(metricData: Partial<RealSustainabilityMetric>): Promise<RealSustainabilityMetric> {
    const response = await this.axiosInstance.post('/sustainability/metrics', metricData);
    return response.data;
  }

  async getCarbonFootprint(villageId: string, timeRange: string): Promise<{ total: number; breakdown: Record<string, number> }> {
    const response = await this.axiosInstance.get(`/sustainability/carbon-footprint/${villageId}`, {
      params: { timeRange }
    });
    return response.data;
  }

  async getEnergyConsumption(villageId: string): Promise<{ renewable: number; grid: number; total: number }> {
    const response = await this.axiosInstance.get(`/sustainability/energy/${villageId}`);
    return response.data;
  }

  // Voice Interface
  async processVoiceCommand(command: string, language: string): Promise<{ response: string; action?: string }> {
    const response = await this.axiosInstance.post('/voice/process', {
      command,
      language
    });
    return response.data;
  }

  // Offline Sync
  async syncOfflineData(offlineData: any[]): Promise<{ synced: number; failed: number }> {
    const response = await this.axiosInstance.post('/sync/offline-data', { data: offlineData });
    return response.data;
  }

  async getOfflineCapableData(villageId: string): Promise<any> {
    const response = await this.axiosInstance.get(`/sync/offline-data/${villageId}`);
    return response.data;
  }

  // Real-time Updates
  async subscribeToUpdates(villageId: string, callback: (data: any) => void): Promise<() => void> {
    // This would typically use WebSocket or Server-Sent Events
    const eventSource = new EventSource(`${this.baseURL}/stream/village/${villageId}`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    return () => {
      eventSource.close();
    };
  }

  // Analytics and Reports
  async getVillageAnalytics(villageId: string, timeRange: string): Promise<any> {
    const response = await this.axiosInstance.get(`/analytics/village/${villageId}`, {
      params: { timeRange }
    });
    return response.data;
  }

  async generateReport(reportType: string, villageId: string, parameters: any): Promise<{ reportUrl: string }> {
    const response = await this.axiosInstance.post('/reports/generate', {
      reportType,
      villageId,
      parameters
    });
    return response.data;
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.axiosInstance.get('/health');
    return response.data;
  }
}

export default ApiService.getInstance();
