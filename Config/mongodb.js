import mongoose from 'mongoose';

const connectDB = async () => {
  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB ✅');
  });
  await mongoose.connect(
    `mongodb+srv://kittipundev:0wAmzt4gOzfuDDbe@cluster0.0hsma.mongodb.net/e-commerce`
  );
};

export default connectDB;
