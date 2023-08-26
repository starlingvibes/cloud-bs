const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSecret = process.env.JWT_SECRET_USER;
const orgSecret = process.env.JWT_SECRET_ADMIN;

exports.verifyUser = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, userSecret);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};

exports.verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, orgSecret);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};

exports.verifyBoth = (req, res, next) => {
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
