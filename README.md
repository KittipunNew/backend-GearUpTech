# 🧠 GearUp Tech - Back-end
Back-end API สำหรับเว็บไซต์ E-commerce GearUp Tech ใช้ Express + MongoDB รองรับการเชื่อมต่อจากทั้งฝั่งลูกค้าและแอดมิน

## 🖥️ Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- Firebase Authentication
- Stripe API
- Multer / Cloudinary (สำหรับอัปโหลดภาพสินค้า)

## 🔄 API

### 🧑‍💼 Authentication
👤 Users API
- `GET /api/users` – ดึงข้อมูลผู้ใช้ (ต้องเข้าสู่ระบบ)
- `POST /api/register` – สมัครสมาชิกใหม่
- `PUT /api/update-info` – อัปเดตข้อมูลผู้ใช้ (ชื่อ, เบอร์โทร ฯลฯ)
🏠 Address API
- `POST /api/create-address` – เพิ่มที่อยู่ใหม่
- `PUT /api/update-address/:addressId` – แก้ไขที่อยู่ที่มีอยู่
- `PUT /api/set-default-address/:addressId` – ตั้งค่าที่อยู่นี้เป็นค่าหลัก
- `DELETE /api/delete-address/:addressId` – ลบที่อยู่ตาม ID

### 📦 Products
- `GET /api/product` – ดึงสินค้าทั้งหมด
- `POST /api/product` – เพิ่มสินค้า (admin เท่านั้น)
- `PUT /api/product/:_id/updateproduct` – อัพเดทข้อมูลสินค้า (admin เท่านั้น)
- `DELETE /api/product/:_id` – ลบสินค้า (admin เท่านั้น)
- `PUT /api/product/:_id/bestseller` – เพิ่มสินค้า Bestseller (admin เท่านั้น)
- `DELETE /api/product/:_id/bestseller` – ลบสินค้า Bestseller (admin เท่านั้น)

### 💖 Wishlis
- `GET /api/wishlist/:userId` – ดึงรายการ wishlist ของผู้ใช้
- `POST /api/add-wishlist` – เพิ่มสินค้าเข้า wishlist
- `DELETE /api/delete-wishlist` – ลบสินค้าออกจาก wishlist

### 🛒 Cart
- `GET /api/cart/:userId` – ดึงรายการสินค้าในตะกร้าของผู้ใช้
- `POST /api/add-cart` – เพิ่มสินค้าลงตะกร้า
- `PUT /api/update-cart/:userId` – อัปเดตรายการในตะกร้า (จำนวนสินค้า)
- `DELETE /api/delete-cart` – ลบสินค้าบางรายการออกจากตะกร้า
- `DELETE /api/clear-cart` – ล้างตะกร้าทั้งหมดของผู้ใช้

### 🚚 Order
- `GET /api/order/:userId`ดึงรายการสั่งซื้อของผู้ใช้
- `GET /api/order`ดึงรายการออเดอร์ทั้งหมด – (admin)
- `POST /api/create-cod-order/:userId` – สร้างออเดอร์แบบเก็บเงินปลายทาง (COD)
- `POST /api/create-checkout-session/:userId` – สร้างออเดอร์ผ่าน Stripe Checkout
- `PATCH /api/order/:id/status` – อัปเดตสถานะคำสั่งซื้อ (admin)

## ▶️ วิธีรันโปรเจค
```bash
npm install
npm start
