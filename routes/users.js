const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();

const {
  getUsers, getUser, updateProfile, updateAvatar, getProfile,
} = require('../controllers/users');

userRouter.get('/users/me', getProfile);
userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*#?$/),
  }),
}), updateAvatar);

userRouter.get('/users/:id', getUser, celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}));
userRouter.get('/users', getUsers);

module.exports = userRouter;
