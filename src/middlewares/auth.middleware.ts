const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSecret = process.env.JWT_SECRET_USER;
const orgSecret = process.env.JWT_SECRET_ADMIN;

const verifyUser = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, userSecret);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};

const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, orgSecret);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};

const verifyBoth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, orgSecret);
    req.userData = decoded;
    next();
  } catch (error) {
    try {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, userSecret);
      req.userData = decoded;
      next();
    } catch (error) {
      return res.sendStatus(401);
    }
  }
};

export { verifyUser, verifyAdmin, verifyBoth };
