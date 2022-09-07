const mongoose = require('mongoose');
const Card = require('../models/card');
const { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR } = require('../constants');

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для создания карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.sendCardsData = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' }));
};

module.exports.deleteCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    res.status(BAD_REQUEST_ERROR).send({ message: 'Передан некорректный ID' });
    return;
  }

  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card !== null) {
        res.send({ data: card });
      } else {
        res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с таким id не найдена' });
      }
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' }));
};

module.exports.likeCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    res.status(BAD_REQUEST_ERROR).send({ message: 'Передан некорректный ID' });
    return;
  }

  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card !== null) {
        res.send({ data: card });
      } else {
        res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с таким id не найдена' });
      }
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' }));
};

module.exports.dislikeCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    res.status(BAD_REQUEST_ERROR).send({ message: 'Передан некорректный ID' });
    return;
  }

  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card !== null) {
        res.send({ data: card });
      } else {
        res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с таким id не найдена' });
      }
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' }));
};
