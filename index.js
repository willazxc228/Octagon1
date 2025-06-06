const express = require('express');
const app = express();
const PORT = 3000;


app.get('/', (req, res) => {
  res.send('<h1>Привет, Октагон!</h1>');  
});

app.get('/static', (req, res) => {
  res.json({ header: "Hello", body: "Octagon NodeJS Test" });
});

app.get('/dynamic', (req, res) => {
  const { a, b, c } = req.query;
  if (!a || !b || !c || isNaN(a) || isNaN(b) || isNaN(c)) {
    return res.json({ header: "Error" });
  }
  const result = (parseInt(a) * parseInt(b) * parseInt(c)) / 3;
  res.json({ header: "Calculated", body: result.toString() });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});