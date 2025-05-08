import cartModel from './../Models/cartModel.js';

// ดึงรายการสินค้าในตะกร้า
const getCartList = async (req, res) => {
  const { userId } = req.params;
  console.log(req.params);
  try {
    const cartList = await cartModel
      .findOne({ userId })
      .populate('items.productId', 'name price images');
    res.status(200).json(cartList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching Cartlist' });
  }
};

// เพิ่มสินค้าลงตะกร้า
const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    // หา cart ของ user นี้
    let cart = await cartModel.findOne({ userId });

    // ถ้ายังไม่มี cart เลย ให้สร้างใหม่
    if (!cart) {
      const newCart = new cartModel({
        userId,
        items: [{ productId, quantity }],
      });
      await newCart.save();
      return res
        .status(201)
        .json({ message: 'Cart created and product added', cart: newCart });
    }

    // ถ้ามี cart แล้ว ให้เช็คว่า product นี้มีอยู่ใน cart หรือยัง
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // ถ้ามีสินค้าอยู่แล้ว → เพิ่มจำนวน
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // ถ้ายังไม่มี → เพิ่มใหม่
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    return res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updatedCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  try {
    if (!productId || typeof quantity !== 'number') {
      return res.status(400).json({ message: 'Missing data' });
    }

    const update = await cartModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          'items.$[elem].quantity': quantity,
        },
      },
      { arrayFilters: [{ 'elem.productId': productId }], new: true }
    );

    res.status(200).json(update);
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};

const RemoveFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  console.log(req.body);
  try {
    const updatedCart = await cartModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );
    if (!updatedCart) return res.status(404).json({ error: 'Cart not found' });
    res.status(200).json(updatedCart);
  } catch (err) {
    console.log(err);
  }
};

export { addToCart, getCartList, updatedCart, RemoveFromCart };
