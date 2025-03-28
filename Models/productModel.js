import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: Array, required: true },
    category: { type: String, required: true },
    bestseller: { type: Boolean },
  },
  { timestamps: true }
);

const productModel =
  mongoose.models.product || mongoose.model('products', productSchema);

export default productModel;
