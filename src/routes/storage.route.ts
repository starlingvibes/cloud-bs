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

// router
//   .route('/upload')
//   .post(upload.single('file'), uploadController.uploadFile);

router.post('/upload', verifyUser, uploadController.upload);
router.get('/download/:name', verifyBoth, uploadController.download);

export default router;
