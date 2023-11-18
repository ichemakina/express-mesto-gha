const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  Created, ValidationError, ForbiddenError, NotFoundError, ServerError,
} = require('../utils/statusCode');

module.exports.getCards = (req, res) => {
  Card.find({})
    .orFail()
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NotFoundError).send({ message: 'Карточки не найдены' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(Created).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ValidationError).send({ message: 'Введены некоректные данные' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return Promise.reject(new Error('Недостаточно прав'));
      }
      return Card
        .findByIdAndDelete(cardId)
        .orFail();
    })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.message === 'Недостаточно прав') {
        return res.status(ForbiddenError).send({ message: 'Недостаточно прав' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NotFoundError).send({ message: 'Карточка не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ValidationError).send({ message: 'Карточка не найдена' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NotFoundError).send({ message: 'Карточка не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ValidationError).send({ message: 'Карточка не найдена' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ValidationError).send({ message: 'Введены некоректные данные' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NotFoundError).send({ message: 'Карточка не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ValidationError).send({ message: 'Карточка не найдена' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ValidationError).send({ message: 'Введены некоректные данные' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};
