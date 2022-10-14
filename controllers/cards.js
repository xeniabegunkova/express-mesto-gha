/* eslint-disable max-len */
const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  NOT_FOUND,
  VALIDATION_ERROR,
  SERVER_ERROR,
  ALERT_MESSAGE,
} = require('../utils/constants');

const createCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(VALIDATION_ERROR).send({ message: ALERT_MESSAGE.GET_CARDS_ERROR });
      }
      return res.status(SERVER_ERROR).send({ message: ALERT_MESSAGE.SERVER_ERROR });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: ALERT_MESSAGE.SERVER_ERROR });
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: ALERT_MESSAGE.DELETE_CARDSID_ERROR });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(VALIDATION_ERROR).send({ message: ALERT_MESSAGE.LIKE_CARDIN_NOT_FOUND });
      }
      return res.status(SERVER_ERROR).send({ message: ALERT_MESSAGE.SERVER_ERROR });
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND).send({ message: ALERT_MESSAGE.DELETE_CARDSID_ERROR });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(VALIDATION_ERROR).send({ message: ALERT_MESSAGE.LIKE_CARDID_VALIDATION_ERROR });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(VALIDATION_ERROR).send({ message: ALERT_MESSAGE.LIKE_CARDID_VALIDATION_ERROR });
    }
    return res.status(SERVER_ERROR).send({ message: ALERT_MESSAGE.SERVER_ERROR });
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND).send({ message: ALERT_MESSAGE.DELETE_CARDSID_ERROR });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(VALIDATION_ERROR).send({ message: ALERT_MESSAGE.LIKE_CARDID_VALIDATION_ERROR });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(VALIDATION_ERROR).send({ message: ALERT_MESSAGE.LIKE_CARDID_VALIDATION_ERROR });
    }
    return res.status(SERVER_ERROR).send({ message: ALERT_MESSAGE.SERVER_ERROR });
  });

module.exports = {
  createCards,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
