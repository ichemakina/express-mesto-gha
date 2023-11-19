const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const handleError = require('./middlewares/handleError');
const NotFoundError = require('./utils/notFoundError');
const { validateLogin, validateRegister } = require('./middlewares/validation');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/signin', validateLogin, login);
app.post('/signup', validateRegister, createUser);

app.use(cookieParser());
app.use(auth);

app.use('/users', users);
app.use('/cards', cards);

app.use((req, res, next) => next(new NotFoundError('Некорректный URL')));

app.use(errors());
app.use(handleError);

app.listen(PORT);
