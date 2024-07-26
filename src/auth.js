// src/auth.js
const jwt = require('jsonwebtoken');

const createAccessToken = (data, expiresIn = '1440m') => {
  return jwt.sign(data, process.env.SECRET_KEY, { expiresIn });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ detail: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ detail: 'Invalid token' });
  }
};

const checkAdminAccess = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ detail: 'Access denied. Admin rights required.' });
  }
  next();
};

module.exports = { createAccessToken, verifyToken, checkAdminAccess };