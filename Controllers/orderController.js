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
  const { userId } = req.params;
  const { cartList, address } = req.body;

  try {
    const lineItems = cartList.map((item) => ({
      price_data: {
        currency: 'thb',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // คำนวณยอดรวมทั้งหมด
    const totalAmount = cartList.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // สร้าง Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/place-order-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId,
        address: JSON.stringify(address),
        cartList: JSON.stringify(cartList),
        totalAmount,
      },
    });

    // บันทึก order ลง DB
    const productsForDB = cartList.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderModel.create({
      userId,
      products: productsForDB,
      address,
      totalAmount,
      orderStatus: 'pending',
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Stripe checkout session failed' });
  }
};

export { createCODOrder, createStripeOrder };
