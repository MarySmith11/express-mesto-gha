const Card = require('../models/card');

// errors
const BadRequestError = require('../errors/bad-request-err');
const InternalServerError = require('../errors/internal-server-err');
const NotFoundError = require('../errors/not-found-err');
const BadAccessError = require('../errors/bad-access-err');

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для создания карточки'));
      } else {
        next(new InternalServerError('Ошибка на сервере'));
      }
    });
};

module.exports.sendCardsData = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOneAndRemove({ _id: req.params.cardId })
    .orFail(new NotFoundError('Карточка с таким id не найдена'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        next(new BadAccessError('Карточка принадлежит другому пользователю'));
      } else {
        res.send({ data: card });
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('Карточка с таким id не найдена'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('Карточка с таким id не найдена'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};
