const router = require('express').Router();
const { validateUpdateUser, validateUpdateAvatar, validateUserId } = require('../middlewares/validation');
const {
  getUsers, getUser, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('', getUsers);

router.get('/me', getUser);

router.get('/:userId', validateUserId, getUser);

router.patch('/me', validateUpdateUser, updateUser);

router.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

module.exports = router;
