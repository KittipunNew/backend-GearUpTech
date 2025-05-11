import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './Config/mongodb.js';
import dotenv from 'dotenv';
import connecntCloudinary from './Config/cloudinary.js';
import productRouter from './Routes/productRoute.js';
import userRouter from './Routes/userRoute.js';
import wishlistRouter from './Routes/wishlistRoute.js';
import cartRouter from './Routes/cartRoute.js';
import orderRouter from './Routes/orderRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Service connections
connectDB();
connecntCloudinary();

app.use(morgan('dev'));
app.use(express.json());

app.use(cors());

app.use('/api', productRouter);

app.use('/api', userRouter);

app.use('/api', wishlistRouter);

app.use('/api', cartRouter);

app.use('/api', orderRouter);

// app.use('/', (req, res) => {
//   res.send('API WORKING !!!');
// });

app.listen(port, () => console.log(`Server is running on port ${port}🚀`));
