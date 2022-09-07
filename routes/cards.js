const cardRouter = require('express').Router();

const {
  createCard, sendCardsData, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.delete('/cards/:cardId', deleteCard);
cardRouter.put('/cards/:cardId/likes', likeCard);
cardRouter.delete('/cards/:cardId/likes', dislikeCard);
cardRouter.get('/cards', sendCardsData);
cardRouter.post('/cards', createCard);

module.exports = cardRouter;
