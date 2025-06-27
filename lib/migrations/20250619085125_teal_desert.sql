/*
  # Initial Database Schema for Chosn Platform

  1. New Tables
    - `profiles` - User profile information for both developers and companies
    - `developer_profiles` - Extended information specific to developers
    - `company_profiles` - Extended information specific to companies
    - `skills` - Master list of skills
    - `user_skills` - Many-to-many relationship between users and skills
    - `projects` - Developer portfolio projects
    - `matches` - Matching records between developers and companies
    - `match_responses` - Developer responses to company matches
    - `analytics_events` - User activity tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for companies to view developer profiles
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  user_type text NOT NULL CHECK (user_type IN ('developer', 'company')),
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create developer_profiles table
CREATE TABLE IF NOT EXISTS developer_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  bio text,
  location text,
  timezone text,
  experience_years integer DEFAULT 0,
  availability text DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'not-looking')),
  github_url text,
  linkedin_url text,
  portfolio_url text,
  salary_min integer,
  salary_max integer,
  remote_only boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create company_profiles table
CREATE TABLE IF NOT EXISTS company_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  industry text,
  company_size text,
  website_url text,
  description text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Create user_skills junction table
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level integer DEFAULT 1 CHECK (proficiency_level BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  developer_id uuid REFERENCES developer_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  technologies text[] DEFAULT '{}',
  project_url text,
  github_url text,
  image_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  developer_id uuid REFERENCES developer_profiles(id) ON DELETE CASCADE,
  company_id uuid REFERENCES company_profiles(id) ON DELETE CASCADE,
  position_title text NOT NULL,
  job_description text,
  requirements text[],
  benefits text[],
  salary_min integer,
  salary_max integer,
  location text,
  remote_allowed boolean DEFAULT false,
  match_score integer DEFAULT 0 CHECK (match_score BETWEEN 0 AND 100),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'interested', 'declined', 'interview', 'offer', 'hired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create match_responses table
CREATE TABLE IF NOT EXISTS match_responses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  developer_id uuid REFERENCES developer_profiles(id) ON DELETE CASCADE,
  response text NOT NULL CHECK (response IN ('interested', 'declined')),
  message text,
  created_at timestamptz DEFAULT now()
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Developer profiles policies
CREATE POLICY "Developers can manage own profile"
  ON developer_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Companies can view developer profiles"
  ON developer_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'company'
    )
  );

-- Company profiles policies
CREATE POLICY "Companies can manage own profile"
  ON company_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Developers can view company profiles"
  ON company_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'developer'
    )
  );

-- Skills policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read skills"
  ON skills
  FOR SELECT
  TO authenticated
  USING (true);

-- User skills policies
CREATE POLICY "Users can manage own skills"
  ON user_skills
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Developers can manage own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = developer_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'company'
    )
  );

-- Matches policies
CREATE POLICY "Companies can manage matches they created"
  ON matches
  FOR ALL
  TO authenticated
  USING (auth.uid() = company_id);

CREATE POLICY "Developers can view matches for them"
  ON matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = developer_id);

-- Match responses policies
CREATE POLICY "Developers can manage own responses"
  ON match_responses
  FOR ALL
  TO authenticated
  USING (auth.uid() = developer_id);

CREATE POLICY "Companies can view responses to their matches"
  ON match_responses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = match_id 
      AND matches.company_id = auth.uid()
    )
  );

-- Analytics events policies
CREATE POLICY "Users can manage own analytics"
  ON analytics_events
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert some initial skills
INSERT INTO skills (name, category) VALUES
  ('JavaScript', 'Programming Language'),
  ('TypeScript', 'Programming Language'),
  ('Python', 'Programming Language'),
  ('Java', 'Programming Language'),
  ('Go', 'Programming Language'),
  ('Rust', 'Programming Language'),
  ('React', 'Frontend Framework'),
  ('Vue.js', 'Frontend Framework'),
  ('Angular', 'Frontend Framework'),
  ('Node.js', 'Backend Framework'),
  ('Express.js', 'Backend Framework'),
  ('Django', 'Backend Framework'),
  ('Flask', 'Backend Framework'),
  ('Spring Boot', 'Backend Framework'),
  ('PostgreSQL', 'Database'),
  ('MySQL', 'Database'),
  ('MongoDB', 'Database'),
  ('Redis', 'Database'),
  ('AWS', 'Cloud Platform'),
  ('Google Cloud', 'Cloud Platform'),
  ('Azure', 'Cloud Platform'),
  ('Docker', 'DevOps'),
  ('Kubernetes', 'DevOps'),
  ('Terraform', 'DevOps'),
  ('CI/CD', 'DevOps'),
  ('Git', 'Version Control'),
  ('GraphQL', 'API'),
  ('REST API', 'API'),
  ('Microservices', 'Architecture'),
  ('Machine Learning', 'AI/ML'),
  ('Data Science', 'AI/ML'),
  ('Mobile Development', 'Mobile'),
  ('React Native', 'Mobile'),
  ('Flutter', 'Mobile'),
  ('iOS', 'Mobile'),
  ('Android', 'Mobile')
ON CONFLICT (name) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_developer_profiles_updated_at BEFORE UPDATE ON developer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON company_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();