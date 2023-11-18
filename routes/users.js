const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { URL_PATTERN } = require('../utils/constants');

const {
  getUsers, getUser, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getUser);

router.get('/users/:userId', celebrate({
  query: {
    userId: Joi.string().hex().required(),
  },
}), getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(URL_PATTERN),
  }),
}), updateUserAvatar);

module.exports = router;
