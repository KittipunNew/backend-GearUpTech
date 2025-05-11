import express from 'express';
import {
  getCartList,
  addToCart,
  updatedCart,
  RemoveFromCart,
  clearCart,
} from '../Controllers/cartController.js';
import { verifyFirebaseToken } from '../Middleware/firebaseAdmin.js';

const cartRouter = express.Router();

cartRouter.get('/cart/:userId', verifyFirebaseToken, getCartList);

cartRouter.post('/add-cart', verifyFirebaseToken, addToCart);

cartRouter.put('/update-cart/:userId', verifyFirebaseToken, updatedCart);

cartRouter.delete('/delete-cart', verifyFirebaseToken, RemoveFromCart);

cartRouter.delete('/clear-cart', verifyFirebaseToken, clearCart);

export default cartRouter;
