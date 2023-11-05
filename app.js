const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const users = require('./routes/users');
const cards = require('./routes/cards');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '654624af0a2e8bda02cc7c6e',
  };

  next();
});

app.use(users);
app.use(cards);

app.listen(PORT);
