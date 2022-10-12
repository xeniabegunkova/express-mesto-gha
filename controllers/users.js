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
        return res.status(400).send({ message: 'Ошибка валидации', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Не корректный _id', err });
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
  ).orFail(new Error('NotFounded'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.massage === 'NotFounded') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден', err });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля', err });
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
  ).orFail(new Error('NotFounded'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.massage === 'NotFounded') {
        return res.status(404).send({ message: 'Пользователя с указанным _id не найден', err });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Не корректный _id', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

module.exports = {
  createUser,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
};
