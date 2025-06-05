import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PDFDocument, StandardFonts } from 'pdf-lib';

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
      averageBloomsLevel: 3.2,
      unitStats,
      bloomsDistribution
    });
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

// Generate questions with preview
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

  // Get total available questions for these filters
  db.get(`SELECT COUNT(*) as count FROM questions WHERE ${query.substring(query.indexOf('WHERE') + 6)}`, params, (err, countRow: any) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const availableQuestions = countRow.count;
    
    if (availableQuestions < totalQuestions) {
      res.status(400).json({ 
        error: `Only ${availableQuestions} questions available with the selected filters. Please adjust your criteria.`
      });
      return;
    }

    // Add randomization and limit
    if (randomize) {
      query += ' ORDER BY RANDOM()';
    }
    query += ' LIMIT ?';
    params.push(totalQuestions);

    // Get the questions
    db.all(query, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
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

// Export questions
app.post('/api/export', async (req, res) => {
  const { questions, format, includeAnswers } = req.body;

  try {
    let content = '';
    
    if (format === 'pdf') {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      page.setFont(font);
      let yOffset = page.getHeight() - 50;
      
      questions.forEach((q: any, index: number) => {
        if (yOffset < 50) {
          // Add new page if needed
          const newPage = pdfDoc.addPage();
          newPage.setFont(font);
          yOffset = newPage.getHeight() - 50;
        }
        
        page.drawText(`${index + 1}. ${q.question}`, { x: 50, y: yOffset });
        yOffset -= 20;
        page.drawText(`A) ${q.optionA}`, { x: 70, y: yOffset });
        yOffset -= 15;
        page.drawText(`B) ${q.optionB}`, { x: 70, y: yOffset });
        yOffset -= 15;
        page.drawText(`C) ${q.optionC}`, { x: 70, y: yOffset });
        yOffset -= 15;
        page.drawText(`D) ${q.optionD}`, { x: 70, y: yOffset });
        yOffset -= 25;
        
        if (includeAnswers) {
          page.drawText(`Answer: ${q.correctAnswer}`, { x: 50, y: yOffset });
          yOffset -= 30;
        }
      });
      
      const pdfBytes = await pdfDoc.save();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=questions.pdf');
      res.send(Buffer.from(pdfBytes));
      
    } else if (format === 'txt' || format === 'md') {
      questions.forEach((q: any, index: number) => {
        content += `${index + 1}. ${q.question}\n`;
        content += `A) ${q.optionA}\n`;
        content += `B) ${q.optionB}\n`;
        content += `C) ${q.optionC}\n`;
        content += `D) ${q.optionD}\n`;
        if (includeAnswers) {
          content += `Answer: ${q.correctAnswer}\n`;
        }
        content += '\n';
      });
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename=questions.${format}`);
      res.send(content);
    }
  } catch (error) {
    res.status(500).json({ error: 'Export failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  initializeDatabase();
});