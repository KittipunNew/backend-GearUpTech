import userModel from '../Models/userModel.js';

// สมัครสมาชิก
const register = async (req, res) => {
  try {
    const {
      uid,
      email,
      firstName,
      lastName,
      phoneNumber,
      address,
      dateOfBirth,
    } = req.body;
    const newUser = new userModel({
      uid,
      email,
      firstName,
      lastName,
      phoneNumber,
      address,
      dateOfBirth,
    });
    await newUser.save();
    res.status(201).send('User created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// ดึงข้อมูลผู้ใช้
const getUserById = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const uid = req.user?.uid;

    const user = await userModel.findOne({ uid });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', err });
  }
};

// อัพเดทข้อมูลผู้ใช้
const updateUserInfo = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { firstName, lastName, phoneNumber, dateOfBirth } = req.body;

    const uid = req.user?.uid; // ป้องกัน undefined

    const updatedUser = await userModel.findOneAndUpdate(
      { uid },
      { $set: { firstName, lastName, phoneNumber, dateOfBirth } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({
      message: 'User information updated successfully.',
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
  }
};

const createAddress = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { address } = req.body;

    const uid = req.user?.uid; // ป้องกัน undefined

    const user = await userModel.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ตรวจสอบข้อมูล address ก่อนเพิ่ม
    if (
      !address ||
      !address.addressType ||
      !address.addressDetails ||
      !address.postCode
    ) {
      return res.status(400).json({ message: 'Invalid address data' });
    }

    user.address.push(address); // เพิ่มที่อยู่ใหม่เข้าไปใน array
    await user.save();

    res
      .status(200)
      .json({ message: 'Address added successfully', address: user.address });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export { register, getUserById, updateUserInfo, createAddress };
