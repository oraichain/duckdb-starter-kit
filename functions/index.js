/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require('firebase-functions/v2/https');

const { Database } = require('duckdb');
const path = require('path');
const express = require('express');
const engine = require('express-engine-jsx');
const app = express();

const db = new Database('data');

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
      search,
      items
    });
  });
});

// db.run(`CREATE TABLE data as select * from 'data.json'`);
db.exec("SET memory_limit='100MB'");

exports.app = onRequest(app);
