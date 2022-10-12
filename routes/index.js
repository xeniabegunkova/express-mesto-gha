const express = require('express');
const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use(express.json());

router.use((req, res, next) => {
  req.user = {
    _id: '6346697f2dadb1bb7f46856d',
  };

  next();
});

router.get('/', (req, res) => {
  res.send(req.body);
});

router.use('/users', usersRouter);

router.use('/cards', cardsRouter);

module.exports = router;
