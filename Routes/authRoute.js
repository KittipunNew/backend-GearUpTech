import express from 'express';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.get('/verify', (req, res) => {
  const { token } = req.headers;
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

export default authRouter;
