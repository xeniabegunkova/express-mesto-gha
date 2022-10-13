const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(MONGO_URL);

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '6346697f2dadb1bb7f46856d',
  };

  next();
});

app.use(express.json());

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.get('/', (req, res) => {
  res.send(req.body);
});

app.patch('*', (_req, res) => {
  res.status(404).send({ message: 'Не найдено' });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
