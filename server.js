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
import webhookRouter from './Routes/webhookRoute.js';
import setupSwagger from './swagger.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Service connections
connectDB();
connecntCloudinary();

app.use(morgan('dev'));

// Define the list of allowed origins
const allowedOrigins = [
  'http://localhost:5173', // For local development
  'http://localhost:5174', // For local development
  'http://localhost:5000',
  'https://backend-gearuptech.onrender.com',
  'https://frontend-admin-gearuptech.vercel.app', // For admin app
  'https://gearuptech.vercel.app', // For user app
  'https://gearuptech-git-main-kittipuns-projects.vercel.app', // For user app
  'https://gearuptech-qxijilfxi-kittipuns-projects.vercel.app', // For user app
];

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('❌ Origin not allowed by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET,POST,PUT,PATCH,DELETE,OPTIONS'],
    credentials: true, // Allow cookies or Authorization headers
  })
);

app.use('/api/stripe', webhookRouter);

app.use(express.json());

app.use('/api', productRouter);

app.use('/api', userRouter);

app.use('/api', wishlistRouter);

app.use('/api', cartRouter);

app.use('/api', orderRouter);

setupSwagger(app);

// app.use('/', (req, res) => {
//   res.send('API WORKING !!!');
// });

app.listen(port, () => console.log(`Server is running on port ${port}🚀`));
