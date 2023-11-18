const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../utils/statusCode');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(UnauthorizedError)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};
