const mongoose = require('mongoose');
const Card = require('../models/card');

const Created = 200;
const NotFoundError = require('../utils/notFoundError');
const ServerError = require('../utils/serverError');
const ValidationError = require('../utils/validationError');
const ForbiddenError = require('../utils/forbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail()
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Карточки не найдены'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(Created).send({ data: card }))
    .catch(() => next(new ServerError('Произошла ошибка')));
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return Promise.reject(new ForbiddenError('Недостаточно прав'));
      }
      return Card
        .findByIdAndDelete(cardId)
        .orFail();
    })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err instanceof ForbiddenError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Карточка не найдена'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Карточка не найдена'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Карточка не найдена'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};
