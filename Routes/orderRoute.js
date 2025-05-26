import express from 'express';
import {
  createCODOrder,
  createStripeOrder,
  getOrder,
  adminGetOrder,
  updateOrderStatus,
  getStripeSessionInfo,
} from '../Controllers/orderController.js';
import { verifyFirebaseToken } from '../Middleware/firebaseAdmin.js';

const orderRouter = express.Router();

orderRouter.get('/order/:userId', verifyFirebaseToken, getOrder);

orderRouter.get('/order', verifyFirebaseToken, adminGetOrder);

orderRouter.get(
  '/session/:sessionId',
  verifyFirebaseToken,
  getStripeSessionInfo
);

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

orderRouter.patch('/order/:id/status', verifyFirebaseToken, updateOrderStatus);

export default orderRouter;
