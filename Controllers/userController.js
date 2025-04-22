import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../Models/userModel.js';

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username });
  if (!user) return res.json({ success: false, message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.json({ success: false, message: 'Invalid password' });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ success: true, token, role: user.role });
};

export { login };
