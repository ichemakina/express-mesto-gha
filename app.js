const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const users = require('./routes/users');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
});

app.use(users);

app.listen(PORT);
