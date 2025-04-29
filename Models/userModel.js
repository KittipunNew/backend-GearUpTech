import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
