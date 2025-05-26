
# Local Backend Setup Guide

This guide will help you set up a local Node.js backend to work with your MCQ management frontend.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Backend Setup Instructions

### 1. Create Backend Directory

```bash
mkdir mcq-backend
cd mcq-backend
npm init -y
```

### 2. Install Dependencies

```bash
npm install express sqlite3 multer cors csv-parser markdown-pdf pdf-lib
npm install -D nodemon @types/node typescript ts-node
```

### 3. Create TypeScript Configuration

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "lib": ["es2018"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Create Database Schema

Create `src/database/schema.sql`:
```sql
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
```

### 5. Create Express Server

Create `src/server.ts`:
```typescript
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Initialize SQLite database
const db: Database = new sqlite3.Database('./mcq_database.db');

// Initialize database schema
const initializeDatabase = () => {
  const schema = fs.readFileSync('./src/database/schema.sql', 'utf8');
  db.exec(schema, (err) => {
    if (err) {
      console.error('Error initializing database:', err);
    } else {
      console.log('Database initialized successfully');
    }
  });
};

// Routes

// Get all questions with filters
app.get('/api/questions', (req, res) => {
  const { unit, topic, bloomsLevel, page = 1, limit = 50 } = req.query;
  let query = 'SELECT * FROM questions WHERE 1=1';
  const params: any[] = [];

  if (unit) {
    query += ' AND unit = ?';
    params.push(unit);
  }
  if (topic) {
    query += ' AND topic = ?';
    params.push(topic);
  }
  if (bloomsLevel) {
    query += ' AND blooms_level = ?';
    params.push(bloomsLevel);
  }

  const offset = (Number(page) - 1) * Number(limit);
  query += ` LIMIT ? OFFSET ?`;
  params.push(Number(limit), offset);

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM questions WHERE 1=1';
    const countParams: any[] = [];
    
    if (unit) {
      countQuery += ' AND unit = ?';
      countParams.push(unit);
    }
    if (topic) {
      countQuery += ' AND topic = ?';
      countParams.push(topic);
    }
    if (bloomsLevel) {
      countQuery += ' AND blooms_level = ?';
      countParams.push(bloomsLevel);
    }

    db.get(countQuery, countParams, (err, countRow: any) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        questions: rows,
        total: countRow.total,
        page: Number(page),
        totalPages: Math.ceil(countRow.total / Number(limit))
      });
    });
  });
});

// Get question statistics
app.get('/api/questions/stats', (req, res) => {
  const queries = {
    totalQuestions: 'SELECT COUNT(*) as count FROM questions',
    totalUnits: 'SELECT COUNT(DISTINCT unit) as count FROM questions',
    totalTopics: 'SELECT COUNT(DISTINCT topic) as count FROM questions',
    unitStats: `
      SELECT 
        unit as unitName,
        COUNT(*) as questionCount,
        COUNT(DISTINCT topic) as topicCount,
        MAX(updated_at) as lastUpdated
      FROM questions 
      GROUP BY unit
    `,
    bloomsDistribution: `
      SELECT 
        blooms_level as level,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM questions), 1) as percentage
      FROM questions 
      GROUP BY blooms_level
    `
  };

  Promise.all([
    new Promise((resolve, reject) => {
      db.get(queries.totalQuestions, (err, row: any) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries.totalUnits, (err, row: any) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries.totalTopics, (err, row: any) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    }),
    new Promise((resolve, reject) => {
      db.all(queries.unitStats, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
    new Promise((resolve, reject) => {
      db.all(queries.bloomsDistribution, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    })
  ]).then(([totalQuestions, totalUnits, totalTopics, unitStats, bloomsDistribution]) => {
    res.json({
      totalQuestions,
      totalUnits,
      totalTopics,
      averageBloomsLevel: 3.2, // Calculate based on actual data
      unitStats,
      bloomsDistribution
    });
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

// Generate questions
app.post('/api/questions/generate', (req, res) => {
  const { totalQuestions, selectedUnits, selectedTopics, selectedBloomLevels, randomize } = req.body;
  
  let query = 'SELECT * FROM questions WHERE 1=1';
  const params: any[] = [];

  if (selectedUnits.length > 0) {
    query += ` AND unit IN (${selectedUnits.map(() => '?').join(',')})`;
    params.push(...selectedUnits);
  }

  if (selectedTopics.length > 0) {
    query += ` AND topic IN (${selectedTopics.map(() => '?').join(',')})`;
    params.push(...selectedTopics);
  }

  if (selectedBloomLevels.length > 0) {
    query += ` AND blooms_level IN (${selectedBloomLevels.map(() => '?').join(',')})`;
    params.push(...selectedBloomLevels);
  }

  if (randomize) {
    query += ' ORDER BY RANDOM()';
  }

  query += ' LIMIT ?';
  params.push(totalQuestions);

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get all units with topics
app.get('/api/units', (req, res) => {
  const query = `
    SELECT 
      u.id, u.name, u.description,
      t.id as topic_id, t.name as topic_name
    FROM units u
    LEFT JOIN topics t ON u.id = t.unit_id
    ORDER BY u.id, t.id
  `;

  db.all(query, (err, rows: any[]) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Group topics by unit
    const unitsMap = new Map();
    rows.forEach(row => {
      if (!unitsMap.has(row.id)) {
        unitsMap.set(row.id, {
          id: row.id,
          name: row.name,
          description: row.description,
          topics: []
        });
      }
      
      if (row.topic_id) {
        unitsMap.get(row.id).topics.push({
          id: row.topic_id,
          name: row.topic_name,
          unitId: row.id
        });
      }
    });

    res.json(Array.from(unitsMap.values()));
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  initializeDatabase();
});
```

### 6. Add Scripts to package.json

Add these scripts to your `package.json`:
```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### 7. Run the Backend

```bash
npm run dev
```

The backend will be available at `http://localhost:3001`

## Next Steps

1. Import your existing MCQ data using the import endpoints
2. The frontend will automatically connect to this backend
3. Add more features like question CRUD operations, advanced filtering, etc.

## File Structure

```
mcq-backend/
├── src/
│   ├── database/
│   │   └── schema.sql
│   └── server.ts
├── uploads/
├── package.json
├── tsconfig.json
└── mcq_database.db (created automatically)
```
