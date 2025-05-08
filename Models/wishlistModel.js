import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  addedAt: { type: Date, default: Date.now },
});

const WishlistModel = mongoose.model('Wishlist', wishlistSchema);
export default WishlistModel;
