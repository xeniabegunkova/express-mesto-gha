const mongoose = require('mongoose');
const Card = require('../models/card');

const createCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Ошибка валидации', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Не корректный _id', err });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.', err });
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка. ', err });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка', err });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию', err });
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка. ', err });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка', err });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию', err });
  });

module.exports = {
  createCards,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
