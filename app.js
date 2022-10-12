const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(MONGO_URL);

const app = express();

app.use(express.json());

app.use(routes);

app.get('/', (req, res) => {
  res.send(req.body);
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
