import express from 'express';
import { register, getUserById } from '../Controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/users/:uid', getUserById);

userRouter.post('/register', register);

export default userRouter;
