import OrderModel from '../Models/orderModel.js';

const orderCOD = async (req, res) => {
  try {
    const { userId } = req.params;
    const { cartList } = req.body;

    if (!cartList?.items?.length) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    const products = cartList.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const totalAmount = products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = new OrderModel({
      userId,
      products,
      totalAmount,
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

export { orderCOD };
