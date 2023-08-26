import express from 'express';
import multer from 'multer';
// import { uploadController } from '../controllers/storage.controller';
const uploadController = require('../controllers/storage.controller');
const {
  verifyUser,
  verifyAdmin,
  verifyBoth,
} = require('../middlewares/auth.middleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/upload', verifyBoth, uploadController.upload);
router.get('/download/:name', verifyBoth, uploadController.download);

export default router;
