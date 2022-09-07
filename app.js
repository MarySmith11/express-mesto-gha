const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND_ERROR } = require('./constants');

const app = express();
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6318145e4a21cd089ce613ba',
  };

  next();
});

app.use(bodyParser.json());
app.use(userRouter);
app.use(cardRouter);
app.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
