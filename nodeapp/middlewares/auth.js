require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET


const generateToken = (userName, id, role, email) => {
  return jwt.sign(
    { userName, id, role, email },
    JWT_SECRET,
    { expiresIn: '1h' }

  )

}

function verifyJWT(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const [scheme, token] = auth.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

const validateRole = (...allowedRoles) => {
  return (req, res, next) => {
    // console.log(req)
    // req.user is created by verifyJWT middleware
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: You do not have permission to perform this action"
      });
    }
    next();
  };
};

module.exports = { verifyJWT, generateToken, validateRole };