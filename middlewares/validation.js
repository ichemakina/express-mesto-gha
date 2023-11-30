const { celebrate, Joi } = require('celebrate');
const { URL_PATTERN } = require('../utils/constants');

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateRegister = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(URL_PATTERN),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(URL_PATTERN),
  }),
});

const validateCardId = celebrate({
  query: {
    cardId: Joi.string().length(24).hex(),
  },
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(URL_PATTERN),
  }),
});

const validateUserId = celebrate({
  query: {
    userId: Joi.string().length(24).hex(),
  },
});

module.exports = {
  validateLogin,
  validateRegister,
  validateCreateCard,
  validateCardId,
  validateUpdateUser,
  validateUpdateAvatar,
  validateUserId,
};
