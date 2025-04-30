import express from 'express';
import {
  register,
  getUserById,
  updateUserInfo,
} from '../Controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/users/:uid', getUserById);

userRouter.post('/register', register);

userRouter.put('/update-info/:uid', updateUserInfo);

export default userRouter;
