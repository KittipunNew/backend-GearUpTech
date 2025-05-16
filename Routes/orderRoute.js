import express from 'express';
import {
  createCODOrder,
  createStripeOrder,
  getOrder,
} from '../Controllers/orderController.js';
import { verifyFirebaseToken } from '../Middleware/firebaseAdmin.js';

const orderRouter = express.Router();

orderRouter.get('/order/:userId', verifyFirebaseToken, getOrder);

orderRouter.post(
  '/create-cod-order/:userId',
  verifyFirebaseToken,
  createCODOrder
);

orderRouter.post(
  '/create-checkout-session/:userId',
  verifyFirebaseToken,
  createStripeOrder
);

export default orderRouter;
