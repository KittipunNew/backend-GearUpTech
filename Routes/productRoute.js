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
import { verifyFirebaseToken } from '../Middleware/firebaseAdmin.js';

const productRouter = express.Router();

/**
 * @swagger
 * /api/product:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all product
 *     responses:
 *       200:
 *         description: Success
 */
productRouter.get('/product', listProduct); // รายการสินค้าทั้งหมด

/**
 * @swagger
 * /api/product:
 *   post:
 *     tags:
 *       - Product
 *     summary: add product (role admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
productRouter.post(
  '/product',
  verifyFirebaseToken,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  addProduct
);

/**
 * @swagger
 * /api/product/{_id}/updateproduct:
 *   put:
 *     tags:
 *       - Product
 *     summary: Update product info (role admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
productRouter.put(
  '/product/:_id/updateproduct',
  verifyFirebaseToken,
  UpdateProductInfo
);

/**
 * @swagger
 * /api/product/{_id}/bestseller:
 *   put:
 *     tags:
 *       - Product
 *     summary: Add product to bestseller (role admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
productRouter.put(
  '/product/:_id/bestseller',
  verifyFirebaseToken,
  addBestSeller
);

/**
 * @swagger
 * /api/product/{_id}/bestseller:
 *   delete:
 *     tags:
 *       - Product
 *     summary: Remove product from bestseller (role admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
productRouter.delete(
  '/product/:_id/bestseller',
  verifyFirebaseToken,
  removeBestSeller
);

/**
 * @swagger
 * /api/product/{_id}:
 *   delete:
 *     tags:
 *       - Product
 *     summary: Delete product (role admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
productRouter.delete('/product/:_id', verifyFirebaseToken, removeProduct);

export default productRouter;
