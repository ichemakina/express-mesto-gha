const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  Created, ValidationError, UnauthorizedError, NotFoundError, ServerError,
} = require('../utils/statusCode');

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NotFoundError).send({ message: 'Пользователи не найдены' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NotFoundError).send({ message: 'Пользователь не найден' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ValidationError).send({ message: 'Пользователь не найден' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(Created).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ValidationError).send({ message: 'Введены некоректные данные' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NotFoundError).send({ message: 'Пользователь не найден' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ValidationError).send({ message: 'Пользователь не найден' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ValidationError).send({ message: 'Введены некоректные данные' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NotFoundError).send({ message: 'Пользователь не найден' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ValidationError).send({ message: 'Пользователь не найден' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ValidationError).send({ message: 'Введены некоректные данные' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch(() => {
      res.status(UnauthorizedError).send({ message: 'Ошибка авторизации' });
    });
};
