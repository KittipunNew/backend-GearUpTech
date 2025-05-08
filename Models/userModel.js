import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: [
      {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        addressType: { type: String, required: true },
        addressDetails: { type: String, required: true },
        postCode: { type: String, required: true },
      },
    ],
    dateOfBirth: { type: Date, required: true },
  },
  { timestamps: true }
);

const userModel = mongoose.model('users', userSchema);

export default userModel;
