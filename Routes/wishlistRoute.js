import express from 'express';
import {
  addWishlist,
  deleteWishlist,
  getWishlist,
} from '../Controllers/wishlistController.js';
import { verifyFirebaseToken } from '../Middleware/firebaseAdmin.js';

const wishlistRouter = express.Router();

wishlistRouter.get('/wishlist/:userId', verifyFirebaseToken, getWishlist);

wishlistRouter.post('/add-wishlist', verifyFirebaseToken, addWishlist);

wishlistRouter.delete('/delete-wishlist', verifyFirebaseToken, deleteWishlist);

export default wishlistRouter;
