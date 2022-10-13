/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const User = require('../models/user');

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя', err });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию', err });
    });
};

const getUser = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.', err });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию', err });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId).orFail(new Error('NotFound'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Не корректный _id', err });
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию', err });
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля', err });
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию', err });
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля', err });
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию', err });
    });
};

module.exports = {
  createUser,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
};
