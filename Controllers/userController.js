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
  const { uid } = req.params;
  try {
    const user = await userModel.findOne({ uid: uid });

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
  const { uid } = req.params;
  try {
    const { firstName, lastName, phoneNumber, dateOfBirth } = req.body;

    if (!uid) {
      return res.status(400).json({
        error: 'UID is required to update user information.',
      });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { uid: uid },
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

export { register, getUserById, updateUserInfo };
