import express from 'express';
import { adminLogin } from '../Controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/user/admin', adminLogin);

export default userRouter;
