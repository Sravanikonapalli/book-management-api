require('dotenv').config();
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
const cors = require('cors');
app.use(cors());
app.use(morgan('dev'));
const upload = multer({ dest: 'uploads/' });

// Initialize SQLite DB
const db = new sqlite3.Database('./books.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to SQLite database.');
});

db.run(`
  CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    publishedYear INTEGER NOT NULL
  )
`);

// CONTROLLERS
const bookController = {
  getAll: (req, res) => {
    db.all('SELECT * FROM books', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  },

  getOne: (req, res) => {
    db.get('SELECT * FROM books WHERE id = ?', [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Book not found' });
      res.json(row);
    });
  },

  create: (req, res) => {
    const { title, author, publishedYear } = req.body;
    if (!title || !author || isNaN(publishedYear)) {
      return res.status(400).json({ error: 'Invalid book data' });
    }
    const id = uuidv4();
    db.run(
      'INSERT INTO books (id, title, author, publishedYear) VALUES (?, ?, ?, ?)',
      [id, title, author, Number(publishedYear)],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id, title, author, publishedYear });
      }
    );
  },

  update: (req, res) => {
    const { title, author, publishedYear } = req.body;
    if (!title || !author || isNaN(publishedYear)) {
      return res.status(400).json({ error: 'Invalid book data' });
    }
    db.run(
      'UPDATE books SET title = ?, author = ?, publishedYear = ? WHERE id = ?',
      [title, author, Number(publishedYear), req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Book not found' });
        res.json({ id: req.params.id, title, author, publishedYear });
      }
    );
  },

  delete: (req, res) => {
    db.run('DELETE FROM books WHERE id = ?', [req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Book not found' });
      res.json({ message: 'Book deleted successfully' });
    });
  },

  importCSV: (req, res) => {
    const filePath = req.file.path;
    const csvData = fs.readFileSync(filePath, 'utf8');
    fs.unlinkSync(filePath);

    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const errorRows = [];
    let addedBooksCount = 0;

    const insertBook = db.prepare(
      'INSERT INTO books (id, title, author, publishedYear) VALUES (?, ?, ?, ?)'
    );

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(col => col.trim());
      const rowData = {};
      header.forEach((key, j) => rowData[key] = row[j]);

      const { title, author, publishedyear } = rowData;
      if (!title || !author || isNaN(publishedyear)) {
        errorRows.push(`Row ${i + 1}: Invalid or missing fields`);
        continue;
      }

      insertBook.run(uuidv4(), title, author, Number(publishedyear));
      addedBooksCount++;
    }

    insertBook.finalize();
    res.json({ addedBooksCount, errorRows });
  }
};

// ROUTES
app.get('/books', bookController.getAll);
app.get('/books/:id', bookController.getOne);
app.post('/books', bookController.create);
app.put('/books/:id', bookController.update);
app.delete('/books/:id', bookController.delete);
app.post('/books/import', upload.single('file'), bookController.importCSV);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Server
app.listen(PORT, () => console.log(` Server running at http://localhost:${PORT}`));
