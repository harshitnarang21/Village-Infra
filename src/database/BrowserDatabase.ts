// Browser-compatible database using localStorage
// This replaces the Node.js SQLite database for frontend use

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

// Simple hash function for passwords (browser-compatible)
const simpleHash = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'village-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await simpleHash(password);
  return passwordHash === hash;
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

class BrowserDatabase {
  private static instance: BrowserDatabase;

  private constructor() {}

  public static getInstance(): BrowserDatabase {
    if (!BrowserDatabase.instance) {
      BrowserDatabase.instance = new BrowserDatabase();
    }
    return BrowserDatabase.instance;
  }

  public async initialize(): Promise<void> {
    try {
      console.log('Initializing browser database...');
      
      // Check if we already have data
      const users = this.getFromStorage('users') || [];
      if (users.length === 0) {
        await this.insertSampleData();
      }
      
      console.log('Browser database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize browser database:', error);
      throw error;
    }
  }

  private getFromStorage(key: string): any[] {
    try {
      const data = localStorage.getItem(`village_db_${key}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return [];
    }
  }

  private saveToStorage(key: string, data: any[]): void {
    try {
      localStorage.setItem(`village_db_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  }

  private async insertSampleData(): Promise<void> {
    console.log('Inserting sample data...');

    const villageId = generateId();
    const adminId = generateId();
    const userId = generateId();

    // Insert sample village
    const villages = [{
      id: villageId,
      name: 'Sudarshan Village',
      state: 'Maharashtra',
      district: 'Pune',
      population: 3810,
      area_sq_km: 12.5,
      latitude: 18.5204,
      longitude: 73.8567,
      created_at: new Date().toISOString()
    }];
    this.saveToStorage('villages', villages);

    // Insert sample users
    const adminPasswordHash = await simpleHash('admin123');
    const userPasswordHash = await simpleHash('user123');

    const users: DatabaseUser[] = [
      {
        id: adminId,
        full_name: 'Village Administrator',
        email: 'admin@village.gov.in',
        password_hash: adminPasswordHash,
        role: 'admin',
        village_id: villageId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: userId,
        full_name: 'Rajesh Kumar',
        email: 'rajesh@village.com',
        password_hash: userPasswordHash,
        role: 'user',
        village_id: villageId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    this.saveToStorage('users', users);

    // Insert sample assets
    const assets: DatabaseAsset[] = [
      {
        id: generateId(),
        village_id: villageId,
        asset_type: 'water_pump',
        name: 'Main Water Pump',
        latitude: 18.5204,
        longitude: 73.8567,
        installation_date: '2023-01-15',
        last_maintenance: '2024-12-01',
        health_score: 85,
        status: 'active',
        created_at: new Date().toISOString()
      },
      {
        id: generateId(),
        village_id: villageId,
        asset_type: 'solar_panel',
        name: 'Solar Panel Array A',
        latitude: 18.5214,
        longitude: 73.8577,
        installation_date: '2023-02-20',
        last_maintenance: '2024-11-15',
        health_score: 92,
        status: 'active',
        created_at: new Date().toISOString()
      },
      {
        id: generateId(),
        village_id: villageId,
        asset_type: 'street_light',
        name: 'Street Light Circuit 1',
        latitude: 18.5194,
        longitude: 73.8557,
        installation_date: '2023-03-10',
        last_maintenance: '2024-10-20',
        health_score: 78,
        status: 'active',
        created_at: new Date().toISOString()
      }
    ];
    this.saveToStorage('assets', assets);

    // Insert sample sensor readings
    const sensorReadings: DatabaseSensorReading[] = [];
    assets.forEach(asset => {
      const sensorTypes = asset.asset_type === 'water_pump' ? ['vibration', 'temperature', 'pressure'] :
                         asset.asset_type === 'solar_panel' ? ['voltage', 'current', 'temperature'] :
                         ['current', 'voltage'];

      sensorTypes.forEach(sensorType => {
        for (let i = 0; i < 10; i++) {
          const timestamp = new Date(Date.now() - i * 3600000).toISOString();
          const value = Math.random() * 100 + 50;
          const unit = sensorType === 'temperature' ? '°C' : 
                      sensorType === 'voltage' ? 'V' : 
                      sensorType === 'current' ? 'A' : 
                      sensorType === 'pressure' ? 'PSI' : 'Hz';

          sensorReadings.push({
            id: generateId(),
            asset_id: asset.id,
            sensor_type: sensorType,
            value: value,
            unit: unit,
            timestamp: timestamp,
            quality_score: 0.95
          });
        }
      });
    });
    this.saveToStorage('sensor_readings', sensorReadings);

    // Insert sample maintenance predictions
    const predictions: DatabaseMaintenancePrediction[] = [];
    assets.forEach(asset => {
      if (asset.health_score < 90) {
        const failureDate = new Date(Date.now() + Math.random() * 30 * 24 * 3600000).toISOString().split('T')[0];
        predictions.push({
          id: generateId(),
          asset_id: asset.id,
          predicted_failure_date: failureDate,
          failure_type: 'Component wear',
          confidence_score: 0.75,
          estimated_cost: 15000,
          prevention_actions: JSON.stringify(['Lubricate bearings', 'Replace filters', 'Check electrical connections']),
          created_at: new Date().toISOString(),
          is_resolved: false
        });
      }
    });
    this.saveToStorage('maintenance_predictions', predictions);

    // Insert sample citizen issues
    const issues: DatabaseCitizenIssue[] = [
      {
        id: generateId(),
        village_id: villageId,
        reported_by: userId,
        title: 'Water supply disruption in Sector A',
        description: 'No water supply for the past 2 days in Sector A residential area',
        category: 'water',
        priority: 'high',
        status: 'reported',
        upvotes: 15,
        created_at: new Date().toISOString()
      },
      {
        id: generateId(),
        village_id: villageId,
        reported_by: userId,
        title: 'Street light not working',
        description: 'Street light near community center has been flickering and now completely off',
        category: 'electricity',
        priority: 'medium',
        status: 'acknowledged',
        upvotes: 8,
        created_at: new Date().toISOString()
      }
    ];
    this.saveToStorage('citizen_issues', issues);

    console.log('Sample data inserted successfully');
  }

  // User operations
  public async createUser(userData: Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const users = this.getFromStorage('users');
    const id = generateId();
    const newUser: DatabaseUser = {
      ...userData,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    users.push(newUser);
    this.saveToStorage('users', users);
    return id;
  }

  public async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const users = this.getFromStorage('users');
    return users.find((user: DatabaseUser) => user.email === email) || null;
  }

  public async getUserById(id: string): Promise<DatabaseUser | null> {
    const users = this.getFromStorage('users');
    return users.find((user: DatabaseUser) => user.id === id) || null;
  }

  public async getVillages(): Promise<any[]> {
    return this.getFromStorage('villages');
  }

  // Asset operations
  public async getAssetsByVillage(villageId: string): Promise<DatabaseAsset[]> {
    const assets = this.getFromStorage('assets');
    return assets.filter((asset: DatabaseAsset) => asset.village_id === villageId);
  }

  public async getAssetById(id: string): Promise<DatabaseAsset | null> {
    const assets = this.getFromStorage('assets');
    return assets.find((asset: DatabaseAsset) => asset.id === id) || null;
  }

  public async updateAssetHealth(id: string, healthScore: number): Promise<void> {
    const assets = this.getFromStorage('assets');
    const assetIndex = assets.findIndex((asset: DatabaseAsset) => asset.id === id);
    if (assetIndex !== -1) {
      assets[assetIndex].health_score = healthScore;
      this.saveToStorage('assets', assets);
    }
  }

  // Sensor readings
  public async addSensorReading(reading: Omit<DatabaseSensorReading, 'id' | 'timestamp'>): Promise<string> {
    const readings = this.getFromStorage('sensor_readings');
    const id = generateId();
    const newReading: DatabaseSensorReading = {
      ...reading,
      id,
      timestamp: new Date().toISOString()
    };
    readings.push(newReading);
    this.saveToStorage('sensor_readings', readings);
    return id;
  }

  public async getSensorReadings(assetId: string, limit: number = 100): Promise<DatabaseSensorReading[]> {
    const readings = this.getFromStorage('sensor_readings');
    return readings
      .filter((reading: DatabaseSensorReading) => reading.asset_id === assetId)
      .sort((a: DatabaseSensorReading, b: DatabaseSensorReading) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit);
  }

  // Maintenance predictions
  public async getMaintenancePredictions(assetId?: string): Promise<DatabaseMaintenancePrediction[]> {
    const predictions = this.getFromStorage('maintenance_predictions');
    let filtered = predictions.filter((p: DatabaseMaintenancePrediction) => !p.is_resolved);
    
    if (assetId) {
      filtered = filtered.filter((p: DatabaseMaintenancePrediction) => p.asset_id === assetId);
    }
    
    return filtered.sort((a: DatabaseMaintenancePrediction, b: DatabaseMaintenancePrediction) => 
      new Date(a.predicted_failure_date).getTime() - new Date(b.predicted_failure_date).getTime()
    );
  }

  public async markPredictionResolved(id: string): Promise<void> {
    const predictions = this.getFromStorage('maintenance_predictions');
    const predictionIndex = predictions.findIndex((p: DatabaseMaintenancePrediction) => p.id === id);
    if (predictionIndex !== -1) {
      predictions[predictionIndex].is_resolved = true;
      this.saveToStorage('maintenance_predictions', predictions);
    }
  }

  // Citizen issues
  public async getCitizenIssues(villageId: string): Promise<DatabaseCitizenIssue[]> {
    const issues = this.getFromStorage('citizen_issues');
    return issues
      .filter((issue: DatabaseCitizenIssue) => issue.village_id === villageId)
      .sort((a: DatabaseCitizenIssue, b: DatabaseCitizenIssue) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  public async createCitizenIssue(issue: Omit<DatabaseCitizenIssue, 'id' | 'created_at' | 'upvotes'>): Promise<string> {
    const issues = this.getFromStorage('citizen_issues');
    const id = generateId();
    const newIssue: DatabaseCitizenIssue = {
      ...issue,
      id,
      upvotes: 0,
      created_at: new Date().toISOString()
    };
    issues.push(newIssue);
    this.saveToStorage('citizen_issues', issues);
    return id;
  }

  public async upvoteIssue(id: string): Promise<void> {
    const issues = this.getFromStorage('citizen_issues');
    const issueIndex = issues.findIndex((issue: DatabaseCitizenIssue) => issue.id === id);
    if (issueIndex !== -1) {
      issues[issueIndex].upvotes += 1;
      this.saveToStorage('citizen_issues', issues);
    }
  }

  // Proposals and voting
  public async getProposals(villageId: string): Promise<DatabaseProposal[]> {
    const proposals = this.getFromStorage('proposals');
    return proposals
      .filter((proposal: DatabaseProposal) => proposal.village_id === villageId)
      .sort((a: DatabaseProposal, b: DatabaseProposal) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  public async submitVote(proposalId: string, userId: string, voteType: 'for' | 'against' | 'abstain'): Promise<string> {
    const votes = this.getFromStorage('votes');
    
    // Remove existing vote by this user for this proposal
    const filteredVotes = votes.filter((vote: DatabaseVote) => 
      !(vote.proposal_id === proposalId && vote.user_id === userId)
    );
    
    const id = generateId();
    const newVote: DatabaseVote = {
      id,
      proposal_id: proposalId,
      user_id: userId,
      vote_type: voteType,
      created_at: new Date().toISOString()
    };
    
    filteredVotes.push(newVote);
    this.saveToStorage('votes', filteredVotes);
    return id;
  }

  public async getVoteResults(proposalId: string): Promise<{ for: number; against: number; abstain: number }> {
    const votes = this.getFromStorage('votes');
    const proposalVotes = votes.filter((vote: DatabaseVote) => vote.proposal_id === proposalId);
    
    const results = { for: 0, against: 0, abstain: 0 };
    proposalVotes.forEach((vote: DatabaseVote) => {
      results[vote.vote_type as keyof typeof results]++;
    });
    
    return results;
  }

  // Voice commands
  public async saveVoiceCommand(userId: string, command: string, language: string, response: string, confidence: number): Promise<string> {
    const commands = this.getFromStorage('voice_commands');
    const id = generateId();
    const newCommand = {
      id,
      user_id: userId,
      command,
      language,
      response,
      confidence_score: confidence,
      created_at: new Date().toISOString()
    };
    commands.push(newCommand);
    this.saveToStorage('voice_commands', commands);
    return id;
  }

  public async getVoiceCommands(userId: string, limit: number = 10): Promise<any[]> {
    const commands = this.getFromStorage('voice_commands');
    return commands
      .filter((cmd: any) => cmd.user_id === userId)
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  // Password verification
  public async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await verifyPassword(password, hash);
  }

  public async hashPassword(password: string): Promise<string> {
    return await simpleHash(password);
  }
}

export default BrowserDatabase;
