import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import OrderModel from '../Models/orderModel.js';

dotenv.config();

const webhookRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

webhookRouter.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook Error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ตรวจจับว่า checkout session เสร็จสมบูรณ์ และจ่ายเงินแล้วจริง
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      if (session.payment_status === 'paid') {
        try {
          await OrderModel.findOneAndUpdate(
            { stripeSessionId: session.id },
            { paymentStatus: 'paid' }
          );
          console.log('✅ Payment successful, order updated.');
        } catch (error) {
          console.error('❌ Error updating order:', error.message);
        }
      }
    }
    // ตอบกลับ Stripe ว่าได้รับแล้ว
    res.json({ received: true });
  }
);

export default webhookRouter;
