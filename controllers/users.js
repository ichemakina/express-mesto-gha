const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const Created = 200;
const NotFoundError = require('../utils/notFoundError');
const ServerError = require('../utils/serverError');
const ValidationError = require('../utils/validationError');
const UnauthorizedError = require('../utils/unauthorizedError');
const ConflictError = require('../utils/conflictError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователи не найдены'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

module.exports.getUser = (req, res, next) => {
  let userId;
  if (req.params.userId) {
    userId = req.params.userId;
  } else {
    userId = req.user._id;
  }
  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Пользователь не найден'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(Created).send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Пользователь не найден'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Пользователь не найден'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError('Введены некорректные данные'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Ошибка авторизации'));
    });
};
