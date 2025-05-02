import express from 'express';
import {
  register,
  getUserById,
  updateUserInfo,
  createAddress,
} from '../Controllers/userController.js';
import { verifyFirebaseToken } from '../Middleware/firebaseAdmin.js';

const userRouter = express.Router();

// ข้อมูลผู้ใช้
userRouter.get('/users/:uid', verifyFirebaseToken, getUserById);

// สมัครสมาชิก
userRouter.post('/register', register);

// อัพเดทข้อมูลผู้ใช้
userRouter.put('/update-info/:uid', verifyFirebaseToken, updateUserInfo);

userRouter.post('/create-address', verifyFirebaseToken, createAddress);

export default userRouter;
