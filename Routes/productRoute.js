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
import adminAuth from '../Middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.get('/product', listProduct);

productRouter.post(
  '/product',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  addProduct
);

productRouter.put('/product/:_id/updateproduct', adminAuth, UpdateProductInfo);
productRouter.put('/product/:_id/bestseller', adminAuth, addBestSeller);

productRouter.delete('/product/:_id/bestseller', adminAuth, removeBestSeller);

productRouter.delete('/product/:_id', adminAuth, removeProduct);

export default productRouter;
