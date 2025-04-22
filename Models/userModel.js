import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ['superadmin', 'staff', 'viewer'],
    default: 'viewer',
  },
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
