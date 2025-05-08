import wishlistModel from '../Models/wishlistModel.js';

const getWishlist = async (req, res) => {
  const { userId } = req.params;
  try {
    const wishlist = await wishlistModel.find({ userId });
    res.status(200).json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

const addWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const existingItem = await wishlistModel.findOne({ userId, productId });

    if (existingItem) {
      return res
        .status(400)
        .json({ message: 'This product is already in your Wishlist.' });
    }

    const newWishlistItem = new wishlistModel({ userId, productId });
    await newWishlistItem.save();

    res.status(201).json({
      message: 'Wishlist item added successfully',
      data: newWishlistItem,
    });
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await wishlistModel.findOneAndDelete({
      userId,
      productId,
    });
    res.status(201).json({
      message: 'Successfully deleted item',
    });
  } catch (err) {
    console.log(err);
  }
};

export { addWishlist, getWishlist, deleteWishlist };
