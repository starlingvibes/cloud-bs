const jwt = require('jsonwebtoken');
require('dotenv').config();
import { createClient } from 'redis';

const userSecret = process.env.JWT_SECRET_USER;
const adminSecret = process.env.JWT_SECRET_ADMIN;

// TODO: refactor the redis functions here to use a service
const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    const connectRedisAndCheckToken = async () => {
      const client = createClient({
        url: process.env.REDIS_URL,
      });

      await client.connect();

      await client.on('connect', () => console.log('Redis Client Connected'));
      await client.on('error', (error) =>
        console.log('Redis Client Error: ', error)
      );

      if (
        (await client.hGet(`user:${decoded.userId}`, 'isActive')) === 'false'
      ) {
        throw new Error("User's session has been revoked");
      }
    };

    await connectRedisAndCheckToken();
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
    const decoded = jwt.verify(token, adminSecret);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};

const verifyBoth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, adminSecret);
    req.userData = decoded;
    next();
  } catch (error) {
    try {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, userSecret);
      const connectRedisAndCheckToken = async () => {
        const client = createClient({
          url: process.env.REDIS_URL,
        });

        await client.connect();

        await client.on('connect', () => console.log('Redis Client Connected'));
        await client.on('error', (error) =>
          console.log('Redis Client Error: ', error)
        );

        if (
          (await client.hGet(`user:${decoded.userId}`, 'isActive')) === 'false'
        ) {
          throw new Error("User's session has been revoked");
        }
      };

      await connectRedisAndCheckToken();
      req.userData = decoded;
      next();
    } catch (error) {
      return res.sendStatus(401);
    }
  }
};

export { verifyUser, verifyAdmin, verifyBoth };
