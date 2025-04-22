import express from 'express';
import {
  listProduct,
  addProduct,
  removeProduct,
  addBestSeller,
  removeBestSeller,
  UpdateProductInfo,
} from '../Controllers/productController.js';
import upload from '../Config/multer.js';
import requireRole from '../Middleware/auth.js';

const productRouter = express.Router();

productRouter.get('/product', listProduct); // รายการสินค้าทั้งหมด

// เพิ่มรายการสินค้า
productRouter.post(
  '/product',
  requireRole(['superadmin', 'staff']),
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  addProduct
);

// อัพเดทสินค้า
productRouter.put(
  '/product/:_id/updateproduct',
  requireRole(['superadmin', 'staff']),
  UpdateProductInfo
);

// เพิ่มรายการสินค้าขายดี
productRouter.put(
  '/product/:_id/bestseller',
  requireRole(['superadmin', 'staff']),
  addBestSeller
);

// ลบออกรายการสินค้าขายดี
productRouter.delete(
  '/product/:_id/bestseller',
  requireRole(['superadmin', 'staff']),
  removeBestSeller
);

// ลบข้อมูลสินค้า
productRouter.delete(
  '/product/:_id',
  requireRole(['superadmin']),
  removeProduct
);

export default productRouter;
