const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
}), getCards);

router.post('/cards', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
  query: {
    cardId: Joi.string().required(),
  },
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
  query: {
    cardId: Joi.string().required(),
  },
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
  query: {
    cardId: Joi.string().required(),
  },
}), dislikeCard);

module.exports = router;
