import OrderModel from '../Models/orderModel.js';
import userModel from '../Models/userModel.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import shortid from 'shortid';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getOrder = async (req, res) => {
  const { userId } = req.params;
  try {
    const order = await OrderModel.find({ userId }).populate(
      'products.productId',
      'price images name'
    );
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

const adminGetOrder = async (req, res) => {
  try {
    const order = await OrderModel.find({}).populate(
      'products.productId',
      'price images name'
    );
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const validStatuses = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  if (!validStatuses.includes(orderStatus)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res
      .status(200)
      .json({ message: 'Order status updated.', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// จ่ายปลายทาง
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

    // สร้าง short order ID
    const timestamp = Date.now().toString().slice(-4);
    const numericPart = shortid
      .generate()
      .replace(/\D/g, '')
      .padStart(2, '0')
      .slice(0, 2);
    const shortOrderId = `ORD-${timestamp}${numericPart}`;

    const newOrder = new OrderModel({
      userId,
      products,
      totalAmount,
      address,
      orderStatus: 'pending', // default
      paymentStatus: 'COD',
      shortOrderId,
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

// จ่ายผ่าน stripe
const createStripeOrder = async (req, res) => {
  const { email } = req.user;
  const { userId } = req.params;
  const { cartList, address } = req.body;

  if (!cartList || !Array.isArray(cartList)) {
    return res.status(400).json({ error: 'Invalid cartList data.' });
  }

  try {
    // สร้าง short order ID
    const timestamp = Date.now().toString().slice(-4);
    const numericPart = shortid
      .generate()
      .replace(/\D/g, '')
      .padStart(2, '0')
      .slice(0, 2);
    const shortOrderId = `ORD-${timestamp}${numericPart}`;

    // สร้าง Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: cartList.map((item) => ({
        price_data: {
          currency: 'thb',
          product_data: {
            name: item.productId?.name || 'Unknown Product',
            metadata: {
              orderId: shortOrderId,
            },
          },
          unit_amount: Math.round(item.productId.price * 100),
        },
        quantity: Number(item.quantity || 1),
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        shortOrderId, // บันทึก short ID ใน session
      },
    });

    // คำนวณ totalAmount
    const totalAmount = cartList.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity;
    }, 0);

    // เตรียมข้อมูล products ให้ตรง schema
    const products = cartList.map((item) => ({
      productId: item.productId._id || item.productId,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    // สร้าง Order ใน MongoDB
    await OrderModel.create({
      userId,
      products,
      totalAmount,
      address,
      paymentStatus: 'unpaid',
      orderStatus: 'pending',
      stripeSessionId: session.id,
      shortOrderId,
    });

    res.json({ sessionId: session.id, shortOrderId });
  } catch (error) {
    console.error('Create Stripe Order Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getStripeSessionInfo = async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log('🪪 sessionId:', sessionId); // ✅ เช็กตรงนี้ก่อน

    // ดึง order จาก MongoDB ที่สร้างไว้ก่อนหน้านี้
    const order = await OrderModel.findOne({ stripeSessionId: sessionId });
    console.log('📦 order found:', order); // ✅ เช็กว่าหาเจอหรือไม่

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      shortOrderId: order.shortOrderId,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error('Error fetching order by session ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  createCODOrder,
  createStripeOrder,
  getOrder,
  adminGetOrder,
  updateOrderStatus,
  getStripeSessionInfo,
};
