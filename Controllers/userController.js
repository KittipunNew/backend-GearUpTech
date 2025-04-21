import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

export { adminLogin };
