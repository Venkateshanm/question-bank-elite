-- Create Units table
CREATE TABLE IF NOT EXISTS units (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Topics table
CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  unit_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (unit_id) REFERENCES units (id)
);

-- Create Questions table
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT CHECK(correct_answer IN ('A', 'B', 'C', 'D')) NOT NULL,
  blooms_level TEXT NOT NULL,
  topic TEXT NOT NULL,
  unit TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample units
INSERT OR IGNORE INTO units (name, description) VALUES 
('Unit 1: Fundamentals', 'Basic concepts and principles'),
('Unit 2: Advanced Concepts', 'Complex theories and methods'),
('Unit 3: Practical Applications', 'Real-world implementations'),
('Unit 4: Case Studies', 'Industry examples and analysis'),
('Unit 5: Assessment & Review', 'Evaluation and review methods');

-- Insert sample topics
INSERT OR IGNORE INTO topics (name, unit_id) VALUES 
('Basic Principles', 1),
('Core Concepts', 1),
('Introduction', 1),
('Complex Theories', 2),
('Advanced Methods', 2),
('Case Studies', 3),
('Real-world Examples', 3),
('Industry Examples', 4),
('Historical Cases', 4),
('Evaluation Methods', 5);