const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser, getUserById, updateUser, updateAvatar, getAuthorizedUser,
} = require('../controllers/users');

router.get('/me', getAuthorizedUser);

router.get('/', getUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().min(24).max(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/[\w-]+.[a-z.]+[/*[a-z#]+]?/),
  }),
}), updateAvatar);

module.exports = router;
