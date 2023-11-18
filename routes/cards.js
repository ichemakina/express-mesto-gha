const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('', getCards);

router.post('', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  query: {
    cardId: Joi.string().hex().required(),
  },
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  query: {
    cardId: Joi.string().hex().required(),
  },
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  query: {
    cardId: Joi.string().hex().required(),
  },
}), dislikeCard);

module.exports = router;
