const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: '167.99.8.156',
  port: 3306,
  user: 'study_bot_frontend',
  password: 'yeahBOI',
  database: 'study_bot',
};

const connection = mysql.createConnection(dbConfig);

app.get('/api/tabs', (req, res) => {
  connection.query('SELECT * FROM tabs', (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});

app.post('/api/tabs', (req, res) => {
  const { name } = req.body;
  connection.query('INSERT INTO tabs (name) VALUES (?)', [name], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ id: results.insertId, name });
  });
});

app.delete('/api/tabs', (req, res) => {
  const { id } = req.query;
  connection.query('DELETE FROM tabs WHERE id = ?', [id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.sendStatus(204);
  });
});

app.put('/api/tabs/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  connection.query('UPDATE tabs SET name = ? WHERE id = ?', [name, id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.sendStatus(204);
  });
});

const cards = [];

app.post('/api/cards', (req, res) => {
  const { title, text, tab_id } = req.body;
  connection.query('INSERT INTO cards (title, text, tab_id) VALUES (?, ?, ?)', [title, text, tab_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ id: results.insertId, title, text, tab_id });
  });
});

app.get('/api/cards', (req, res) => {
  const { tab_id } = req.query;
  connection.query('SELECT * FROM cards WHERE tab_id = ?', [tab_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});

app.delete('/api/cards/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM cards WHERE id = ?', [id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.sendStatus(204);
  });
});

app.put('/api/cards/:id', (req, res) => {
  const { id } = req.params;
  const { title, text } = req.body;
  connection.query('UPDATE cards SET title = ?, text = ? WHERE id = ?', [title, text, id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.sendStatus(204);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});