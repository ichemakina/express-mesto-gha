const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUser, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
}), getUsers);

router.get('/users/me', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
}), getUser);

router.get('/users/:userId', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
  query: {
    userId: Joi.string().required(),
  },
}), getUser);

router.patch('/users/me', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateUserAvatar);

module.exports = router;
