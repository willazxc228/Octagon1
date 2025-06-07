const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ChatBotTests'
});

connection.connect(err => {
  if (err) {
    console.error('Ошибка подключения к БД:', err);
    return;
  }
  console.log('Подключение к БД успешно');
});


app.use(express.json());


app.get('/getAllItems', (req, res) => {
  connection.query('SELECT * FROM Items', (err, results) => {
    if (err) {
      return res.json(null);
    }
    res.json(results);
  });
});


app.post('/addItem', (req, res) => {
  const { name, desc } = req.query;
  
  if (!name || !desc) {
    return res.json(null);
  }

  connection.query(
    'INSERT INTO Items (name, `desc`) VALUES (?, ?)',
    [name, desc],
    (err, results) => {
      if (err) {
        return res.json(null);
      }
      res.json({ id: results.insertId, name, desc });
    }
  );
});


app.post('/deleteItem', (req, res) => {
  const { id } = req.query;
  
  if (!id || isNaN(id)) {
    return res.json(null);
  }

  connection.query(
    'SELECT * FROM Items WHERE id = ?',
    [id],
    (err, results) => {
      if (err || results.length === 0) {
        return res.json({});
      }

      connection.query(
        'DELETE FROM Items WHERE id = ?',
        [id],
        (err) => {
          if (err) {
            return res.json(null);
          }
          res.json(results[0]);
        }
      );
    }
  );
});


app.post('/updateItem', (req, res) => {
  const { id, name, desc } = req.query;
  
  if (!id || isNaN(id) || !name || !desc) {
    return res.json(null);
  }

  connection.query(
    'UPDATE Items SET name = ?, `desc` = ? WHERE id = ?',
    [name, desc, id],
    (err, results) => {
      if (err || results.affectedRows === 0) {
        return res.json({});
      }
      
      connection.query(
        'SELECT * FROM Items WHERE id = ?',
        [id],
        (err, updatedResults) => {
          if (err) {
            return res.json(null);
          }
          res.json(updatedResults[0]);
        }
      );
    }
  );
});

app.listen(PORT, '0.0.0.0', () => {  
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});