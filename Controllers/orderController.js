import OrderModel from '../Models/orderModel.js';
import userModel from '../Models/userModel.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCODOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { cartList, address } = req.body;

    if (!cartList?.items?.length) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const products = cartList.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    // คำนวณยอดรวมทั้งหมด
    const totalAmount = products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = new OrderModel({
      userId,
      products,
      totalAmount,
      address,
      orderStatus: 'pending', // default
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: 'COD order created successfully.', order: newOrder });
  } catch (error) {
    console.error('Error creating COD order:', error);
    res.status(500).json({ message: 'Server error while creating COD order.' });
  }
};

const createStripeOrder = async (req, res) => {
  const { email } = req.user;
  const { cartList, address } = req.body;

  console.log('cartList:', cartList);

  if (!cartList || !Array.isArray(cartList)) {
    return res.status(400).json({ error: 'Invalid cartList data.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: cartList.map((item) => ({
        price_data: {
          currency: 'thb',
          product_data: {
            name: item.productId?.name || 'Unknown Product',
          },
          unit_amount: Math.round(item.productId.price * 100),
        },
        quantity: Number(item.quantity || 1),
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/place-order-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { createCODOrder, createStripeOrder };
