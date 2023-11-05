const mongoose = require('mongoose');
const User = require('../models/user');
const {
  Created, ValidationError, NotFoundError, ServerError,
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
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
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
