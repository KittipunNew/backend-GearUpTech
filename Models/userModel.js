import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
      },
    ], // ตะกร้าสินค้าของผู้ใช้
    wishlist: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
          required: true,
        },
        addedAt: { type: Date, default: Date.now },
      },
    ], // รายการสินค้าที่ผู้ใช้สนใจ
    orders: [
      {
        orderId: { type: String, required: true },
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
        ], // รายการสินค้าที่สั่งซื้อ
        totalAmount: { type: Number, required: true }, // ราคารวม
        orderStatus: {
          type: String,
          enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
          default: 'pending',
        }, // สถานะคำสั่งซื้อ
        orderedAt: { type: Date, default: Date.now }, // วันที่สั่งซื้อ
      },
    ], // คำสั่งซื้อของผู้ใช้
  },
  { timestamps: true }
);

const userModel = mongoose.model('User', userSchema);

export default userModel;
