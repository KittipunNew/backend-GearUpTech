import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    address: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      addressType: { type: String, required: true },
      addressDetails: { type: String, required: true },
      postCode: { type: String, required: true },
      isDefault: { type: Boolean, default: false },
    },
    totalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    orderedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;
