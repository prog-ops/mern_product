const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'productdb'
});

app.get('/api/productlist', (req, res) => {
  connection.query('SELECT * FROM product', (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
