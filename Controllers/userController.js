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

// ฟังก์ชั่นดึงข้อมูล user
const getUserById = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await userModel.findOne({ uid: uid });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

export { register, getUserById };
