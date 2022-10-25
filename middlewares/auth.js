const jwt = require('jsonwebtoken');
const { ALERT_MESSAGE } = require('../utils/constants');
const UnauthorizedError = require('../errors/Unauthorized');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError(ALERT_MESSAGE.AUTHORIZATION_REQ);
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new UnauthorizedError(ALERT_MESSAGE.AUTHORIZATION_REQ);
  }
  req.user = payload;

  next();
};
