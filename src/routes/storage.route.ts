import express from 'express';
import multer from 'multer';
// import { uploadController } from '../controllers/storage.controller';
const uploadController = require('../controllers/storage.controller');
const { verifyAdmin, verifyBoth } = require('../middlewares/auth.middleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/upload', verifyBoth, uploadController.upload);
router.get('/download/:fileName', verifyBoth, uploadController.download);
router.get(
  '/download/:folderName/:fileName',
  verifyBoth,
  uploadController.download
);
router.post('/create-folder', verifyBoth, uploadController.createFolder);
router.delete('/delete/:fileName', verifyBoth, uploadController.deleteFile);

// Admin-only routes
router.post(
  '/mark-unsafe/:id',
  verifyAdmin,
  uploadController.markUnsafeAndDelete
);

export default router;
