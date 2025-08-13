import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function auth(req, res, next) {
  try {
    // Check multiple possible header locations
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Authorization header missing',
        solution: 'Include "Authorization: Bearer <token>" header'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Malformed token',
        solution: 'Token should be in format: Bearer <token>'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        solution: 'Refresh your token by logging in again'
      });
    }
    
    res.status(401).json({ 
      message: 'Invalid token',
      error: err.message,
      solution: 'Check token validity or obtain a new one'
    });
  }
}