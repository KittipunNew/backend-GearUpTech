import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import OrderModel from '../Models/orderModel.js';

dotenv.config();

const webhookRouter = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

webhookRouter.post('/webhook', express.raw({ type: 'application/json' })),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_SECRET_KEY
      );
    } catch (err) {
      console.error('Webhook Error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ตรวจจับว่า payment จบแล้ว
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      try {
        // บันทึกคำสั่งซื้อ (หรืออัปเดต status ว่า "paid")
        await OrderModel.findOneAndUpdate(
          { stripeSessionId: session.id },
          { status: 'paid' }
        );

        console.log('Payment successful, order updated.');
      } catch (error) {
        console.error('Error updating order:', error.message);
      }
    }

    res.json({ received: true });
  };

export default webhookRouter;
