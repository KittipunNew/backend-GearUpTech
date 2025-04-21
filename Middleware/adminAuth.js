import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    console.log(token);
    if (!token) {
      return res.json({
        success: false,
        message: 'Not Authorized Login Again',
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    if (token_decode.username !== process.env.ADMIN_USERNAME) {
      return res.json({
        success: false,
        message: 'Not Authorized Login Again',
      });
    }

    next();
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

export default adminAuth;
