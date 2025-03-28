import express from 'express';
import { listProduct, addProduct } from '../Controllers/productController.js';
import upload from '../Config/multer.js';

const productRouter = express.Router();

productRouter.get('/product', listProduct);

productRouter.post(
  '/product',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  addProduct
);

export default productRouter;
