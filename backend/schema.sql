-- FoodWise AI: Production Database Schema for Supabase PostgreSQL
-- Enable pgcrypto / uuid-ossp for gen_random_uuid if not enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'manager',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Consumption & History Table
CREATE TABLE IF NOT EXISTS consumption (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  day_of_week VARCHAR(20) NOT NULL,
  people_expected INTEGER NOT NULL,
  food_prepared INTEGER NOT NULL,
  food_consumed INTEGER,
  food_wasted INTEGER GENERATED ALWAYS AS (food_prepared - food_consumed) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Predictions Table
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_date DATE NOT NULL,
  expected_people INTEGER NOT NULL,
  predicted_demand INTEGER NOT NULL,
  recommended_quantity INTEGER NOT NULL,
  safety_buffer INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Organizations (For Surplus Food Redistribution)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Surplus Distribution Table
CREATE TABLE IF NOT EXISTS surplus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  record_date DATE NOT NULL,
  quantity INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'Available', -- 'Available', 'Offered', 'Claimed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Indexes for Performance and Data Isolation
CREATE INDEX IF NOT EXISTS idx_consumption_user_date ON consumption(user_id, record_date DESC);
CREATE INDEX IF NOT EXISTS idx_consumption_day ON consumption(user_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_predictions_user_date ON predictions(user_id, target_date DESC);
CREATE INDEX IF NOT EXISTS idx_surplus_user ON surplus(user_id);
CREATE INDEX IF NOT EXISTS idx_organizations_available ON organizations(is_available);

-- 7. Seed Initial Verified Organizations
INSERT INTO organizations (name, location, contact_email) 
SELECT 'Community Food Center', 'Downtown', 'contact@cfc.org'
WHERE NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Community Food Center');

INSERT INTO organizations (name, location, contact_email) 
SELECT 'Local Shelter', 'Westside', 'help@shelter.org'
WHERE NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Local Shelter');

INSERT INTO organizations (name, location, contact_email) 
SELECT 'Food Redistribution NGO', 'North District', 'logistics@foodngo.org'
WHERE NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Food Redistribution NGO');
