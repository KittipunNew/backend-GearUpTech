import productModel from '../Models/productModel.js';
import { v2 as cloudinary } from 'cloudinary';

// สำหรับ admin เพิ่มสินค้า
const addProduct = async (req, res) => {
  try {
    const { name, description, specs, price, category, bestseller } = req.body;

    // ตรวจสอบจำนวนสินค้า bestseller
    if (bestseller) {
      const bestsellerCount = await productModel.countDocuments({
        bestseller: true,
      });

      if (bestsellerCount > 8) {
        return res.json({
          success: false,
          message: 'Cannot add more bestseller products. Limit is 8.',
        });
      }
    }

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    // อัปโหลดภาพไปที่ Cloudinary
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image',
        });
        return result.secure_url;
      })
    );

    const specsArray =
      typeof specs === 'string'
        ? specs.split('\n').map((item) => item.trim())
        : [];

    const productData = {
      name,
      description,
      specs: specsArray,
      price,
      images: imagesUrl,
      category,
      bestseller,
    };

    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: 'Product Added' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// รายการสินค้า
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ฟังก์ชั่นเพิ่ม สินค้าขายดี
const addBestSeller = async (req, res) => {
  const { _id } = req.params;
  const { bestseller } = req.body;
  try {
    // ตรวจสอบจำนวนสินค้า bestseller
    if (bestseller === true) {
      const bestsellerCount = await productModel.countDocuments({
        bestseller: true,
      });

      // จำกัดให้รายการ สินค้าขายดี สูงสุด 8 รายการ
      if (bestsellerCount >= 8) {
        return res.status(400).json({
          success: false,
          message: 'Cannot add more bestseller products. Limit is 8.',
        });
      }
    }
    const product = await productModel.findByIdAndUpdate(
      _id,
      { bestseller },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// ฟังก์ชั่นแก้ไขข้อมูลสินค้า
const UpdateProductInfo = async (req, res) => {
  const { _id } = req.params;
  const { name, description, specs, category, price } = req.body;
  try {
    const product = await productModel.findByIdAndUpdate(
      _id,
      { name, description, specs, category, price },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// ลบรายการสินค้าขายดี
const removeBestSeller = async (req, res) => {
  const { _id } = req.params;
  try {
    const product = await productModel.findByIdAndUpdate(
      _id,
      { bestseller: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// ลบข้อมูลสินค้า
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params._id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  listProduct,
  addProduct,
  removeProduct,
  addBestSeller,
  removeBestSeller,
  UpdateProductInfo,
};
