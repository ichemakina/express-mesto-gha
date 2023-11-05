const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.getUsers = router.get('/users', (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(400).send({ message: 'Пользователи не найдены' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
});

module.exports.getUser = router.get('/users/:userId', (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
});

module.exports.createUser = router.post('/users', (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Введены некоректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
});

module.exports.updateUser = router.patch('/users/me', (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Введены некоректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
});

module.exports.updateUserAvatar = router.patch('/users/me/avatar', (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send({ data: user }, { new: true }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Введены некоректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
});
