import express from 'express';
const historyController = require('../controllers/history.controller');
const { verifyAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', verifyAdmin, historyController.getFileHistory);
router.get('/:userId', verifyAdmin, historyController.getFileHistoryForUser);

export default router;
