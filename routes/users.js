const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getUser);
router.get('/users/:userId', getUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
