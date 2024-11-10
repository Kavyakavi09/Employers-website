import jwt from 'jsonwebtoken';

export const verifyToken = (req) => {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Authorization: Bearer <token>

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
