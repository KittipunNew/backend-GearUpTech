import express from 'express';
import {
  register,
  getUserById,
  updateUserInfo,
  createAddress,
  updateUserAddress,
  setDefaultAddress,
  deleteUserAddress,
} from '../Controllers/userController.js';
import { verifyFirebaseToken } from '../Middleware/firebaseAdmin.js';

const userRouter = express.Router();

// ข้อมูลผู้ใช้
userRouter.get('/users', verifyFirebaseToken, getUserById);

// สมัครสมาชิก
userRouter.post('/register', register);

// อัพเดทข้อมูลผู้ใช้
userRouter.put('/update-info', verifyFirebaseToken, updateUserInfo);

// เพิ่มที่อยู่
userRouter.post('/create-address', verifyFirebaseToken, createAddress);

// อัพเดทข้อมูลที่อยู่
userRouter.put(
  '/update-address/:addressId',
  verifyFirebaseToken,
  updateUserAddress
);

userRouter.put(
  '/set-default-address/:addressId',
  verifyFirebaseToken,
  setDefaultAddress
);

// ลบที่อยู่
userRouter.delete(
  '/delete-address/:addressId',
  verifyFirebaseToken,
  deleteUserAddress
);

export default userRouter;
