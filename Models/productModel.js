import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    specs: [{ type: String }],
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: String, required: true },
    bestseller: { type: Boolean, default: false },
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const productModel =
  mongoose.models.products || mongoose.model('products', productSchema);

export default productModel;
