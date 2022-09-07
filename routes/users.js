const userRouter = require('express').Router();

const {
  createUser, getUsers, getUser, updateProfile, updateAvatar,
} = require('../controllers/users');

userRouter.get('/users/:userId', getUser);
userRouter.patch('/users/me', updateProfile);
userRouter.patch('/users/me/avatar', updateAvatar);
userRouter.post('/users', createUser);
userRouter.get('/users', getUsers);

module.exports = userRouter;
