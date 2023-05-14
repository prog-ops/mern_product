const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'productdb',
});

// GET all products
app.get('/api/productlist', (req, res) => {
  pool.query('SELECT * FROM product', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// GET a single product by ID
app.get('/api/productlist/:id', (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM product WHERE id = ?', id, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(rows[0]);
    }
  });
});

// CREATE a new product
app.post('/api/productlist', (req, res) => {
  const { name, buy_price, sell_price, stock, photo_url } = req.body;
  pool.query(
      'INSERT INTO product (name, buy_price, sell_price, stock, photo_url) VALUES (?, ?, ?, ?, ?)',
      [name, buy_price, sell_price, stock, photo_url],
      (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          const newProduct = { id: result.insertId, name, buy_price, sell_price, stock, photo_url };
          res.status(201).json(newProduct);
        }
      }
  );
});

// UPDATE an existing product by ID
app.put('/api/productlist/:id', (req, res) => {
  const { id } = req.params;
  const { name, buy_price, sell_price, stock, photo_url } = req.body;
  pool.query(
      'UPDATE product SET name = ?, buy_price = ?, sell_price = ?, stock = ?, photo_url = ? WHERE id = ?',
      [name, buy_price, sell_price, stock, photo_url, id],
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.sendStatus(204);
        }
      }
  );
});

// DELETE a product by ID
app.delete('/api/productlist/:id', (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM product WHERE id = ?', id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.sendStatus(204);
    }
  });
});

// DELETE all products
app.delete('/api/productlist', (req, res) => {
  const sql = 'DELETE FROM product';
  pool.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.sendStatus(204); // No content
    }
  });
});

app.listen(port, () => {
  console.log('Server listening on port 3001');
});
