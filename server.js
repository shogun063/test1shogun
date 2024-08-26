const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'shopdee',
});

db.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/product', function(req, res) {
  const { productName, productDetail, price, cost, quantity } = req.body;
  const sql = 'INSERT INTO product (productName, productDetail, price, cost, quantity) VALUES (?, ?, ?, ?, ?)';
  const values = [productName, productDetail, price, cost, quantity];
  
  db.query(sql, values, function(err, result) {
    if (err) throw err;
    res.send({ 'message': 'บันทึกข้อมูลสำเร็จ', 'status': true });
  });
});

app.get('/product/:id', function(req, res) {
  const productID = req.params.id;
  const sql = 'SELECT * FROM product WHERE productID = ?';
  
  db.query(sql, [productID], function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.post('/login', function(req, res) {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM customer WHERE username = ? AND password = ? AND isActive = 1';
  const values = [username, password];
  
  db.query(sql, values, function(err, result) {
    if (err) throw err;
    if (result.length > 0) {
      let customer = result[0];
      customer['message'] = 'เข้าสู่ระบบสำเร็จ';
      customer['status'] = true;
      res.send(customer);
    } else {
      res.send({ 'message': 'กรุณาระบุรหัสผ่านใหม่อีกครั้ง', 'status': false });
    }
  });
});

app.listen(port, function() {
  console.log(`Server listening on port ${port}`);
});
