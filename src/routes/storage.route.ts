import express from 'express';
import multer from 'multer';
// import { uploadController } from '../controllers/storage.controller';
const uploadController = require('../controllers/storage.controller');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// router
//   .route('/upload')
//   .post(upload.single('file'), uploadController.uploadFile);

router.post('/upload', uploadController.upload);

export default router;
