import jwt from 'jsonwebtoken';

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!allowedRoles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ message: 'Forbidden - insufficient rights' });
      }

      req.user = decoded; // แนบข้อมูล user ไว้ใช้ต่อ
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

export default requireRole;
