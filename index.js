const { Database } = require('duckdb');
const path = require('path');
const express = require('express');
const engine = require('express-engine-jsx');
const app = express();
const port = process.env.PORT || 3000;

const db = new Database(':memory:');

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', engine);

app.get('/', (req, res) => {
  const { offset = 0, search } = req.query;
  let sql = `select * from data`;
  if (search) {
    sql += ` where title ilike '%${search}%' or description ilike '%${search}%'`;
  }
  sql += ` offset ${offset} limit 10`;

  db.all(sql, (err, items) => {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.render('list', {
      items
    });
  });
});

app.listen(port, () => {
  db.run(`CREATE TABLE data as select * from 'data.json'`, (err) => {
    if (!err) {
      console.log(`Example app listening on port ${port}`);
    }
  });
});
