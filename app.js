const mongoose = require('mongoose');
const express = require('express');
const { PORT= 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);