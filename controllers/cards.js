const router = require('express').Router();
const mongoose = require('mongoose');
const Card = require('../models/card');
const { ValidationError, NotFoundError, ServerError } = require('../utils/errorStatusCode');

module.exports.getCards = router.get('/cards', (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NotFoundError).send({ message: 'Карточки не найдены' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
});

module.exports.createCard = router.post('/cards', (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ValidationError).send({ message: 'Введены некоректные данные' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
});

module.exports.deleteCard = router.delete('/cards/:cardId', (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(NotFoundError).send({ message: 'Карточка не найдена' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
});

module.exports.likeCard = router.put('/cards/:cardId/likes', (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(NotFoundError).send({ message: 'Карточка не найдена' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ValidationError).send({ message: 'Введены некоректные данные' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
});

module.exports.dislikeCard = router.delete('/cards/:cardId/likes', (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(NotFoundError).send({ message: 'Карточка не найдена' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ValidationError).send({ message: 'Введены некоректные данные' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
});
