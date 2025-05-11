import express from 'express';
import { orderCOD } from '../Controllers/orderController.js';
import { verifyFirebaseToken } from '../Middleware/firebaseAdmin.js';

const orderRouter = express.Router();

orderRouter.post('/create-cod-order/:userId', verifyFirebaseToken, orderCOD);

export default orderRouter;
