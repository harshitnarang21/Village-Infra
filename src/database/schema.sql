-- Village Infrastructure Digital Twin Database Schema
-- SQLite version for development

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    village_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Villages table
CREATE TABLE IF NOT EXISTS villages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    population INTEGER,
    area_sq_km REAL,
    latitude REAL,
    longitude REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Infrastructure assets
CREATE TABLE IF NOT EXISTS infrastructure_assets (
    id TEXT PRIMARY KEY,
    village_id TEXT NOT NULL,
    asset_type TEXT NOT NULL,
    name TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    installation_date DATE,
    last_maintenance DATE,
    health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
    metadata TEXT, -- JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (village_id) REFERENCES villages(id)
);

-- Sensor readings
CREATE TABLE IF NOT EXISTS sensor_readings (
    id TEXT PRIMARY KEY,
    asset_id TEXT NOT NULL,
    sensor_type TEXT NOT NULL,
    value REAL NOT NULL,
    unit TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    quality_score REAL DEFAULT 1.0,
    FOREIGN KEY (asset_id) REFERENCES infrastructure_assets(id)
);

-- Maintenance predictions
CREATE TABLE IF NOT EXISTS maintenance_predictions (
    id TEXT PRIMARY KEY,
    asset_id TEXT NOT NULL,
    predicted_failure_date DATE NOT NULL,
    failure_type TEXT NOT NULL,
    confidence_score REAL NOT NULL,
    estimated_cost REAL,
    prevention_actions TEXT, -- JSON array as string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_resolved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (asset_id) REFERENCES infrastructure_assets(id)
);

-- Citizen issues
CREATE TABLE IF NOT EXISTS citizen_issues (
    id TEXT PRIMARY KEY,
    village_id TEXT NOT NULL,
    reported_by TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'acknowledged', 'in_progress', 'resolved')),
    latitude REAL,
    longitude REAL,
    photo_urls TEXT, -- JSON array as string
    video_urls TEXT, -- JSON array as string
    upvotes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (village_id) REFERENCES villages(id),
    FOREIGN KEY (reported_by) REFERENCES users(id)
);

-- Community proposals
CREATE TABLE IF NOT EXISTS proposals (
    id TEXT PRIMARY KEY,
    village_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    budget_amount REAL,
    submitted_by TEXT NOT NULL,
    voting_deadline DATETIME NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'passed', 'rejected', 'expired')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (village_id) REFERENCES villages(id),
    FOREIGN KEY (submitted_by) REFERENCES users(id)
);

-- Votes
CREATE TABLE IF NOT EXISTS votes (
    id TEXT PRIMARY KEY,
    proposal_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('for', 'against', 'abstain')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proposal_id) REFERENCES proposals(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(proposal_id, user_id)
);

-- Blockchain transactions
CREATE TABLE IF NOT EXISTS blockchain_transactions (
    id TEXT PRIMARY KEY,
    village_id TEXT NOT NULL,
    transaction_type TEXT NOT NULL,
    amount REAL,
    description TEXT NOT NULL,
    block_hash TEXT NOT NULL,
    transaction_hash TEXT NOT NULL,
    from_address TEXT,
    to_address TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (village_id) REFERENCES villages(id)
);

-- Sustainability metrics
CREATE TABLE IF NOT EXISTS sustainability_metrics (
    id TEXT PRIMARY KEY,
    village_id TEXT NOT NULL,
    metric_type TEXT NOT NULL,
    value REAL NOT NULL,
    unit TEXT NOT NULL,
    measurement_date DATE NOT NULL,
    source TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (village_id) REFERENCES villages(id)
);

-- Voice commands
CREATE TABLE IF NOT EXISTS voice_commands (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    command TEXT NOT NULL,
    language TEXT NOT NULL,
    response TEXT NOT NULL,
    confidence_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_village ON users(village_id);
CREATE INDEX IF NOT EXISTS idx_assets_village ON infrastructure_assets(village_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON infrastructure_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_asset ON sensor_readings(asset_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON sensor_readings(timestamp);
CREATE INDEX IF NOT EXISTS idx_issues_village ON citizen_issues(village_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON citizen_issues(status);
CREATE INDEX IF NOT EXISTS idx_proposals_village ON proposals(village_id);
CREATE INDEX IF NOT EXISTS idx_votes_proposal ON votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_village ON blockchain_transactions(village_id);
CREATE INDEX IF NOT EXISTS idx_sustainability_village ON sustainability_metrics(village_id);
CREATE INDEX IF NOT EXISTS idx_voice_commands_user ON voice_commands(user_id);
