import express from 'express';
import { login } from '../Controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/admin/login', login);

export default userRouter;
