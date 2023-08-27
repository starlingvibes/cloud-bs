const processUploadedFile = require('../middlewares/processFile.middleware');
const { format } = require('util');
const { Storage } = require('@google-cloud/storage');
const uuid = require('uuid');
import { Request, Response } from 'express';
import { HistoryService } from '../services/history.service';

const historyService = new HistoryService();

const getFileHistory = async (req: Request, res: Response) => {
  try {
    const allHistory = await historyService.fetchHistory();

    return res.status(200).json({
      status: 'success',
      message: 'History fetched successfully',
      data: allHistory,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: `An error occurred while fetching history - ${error}`,
      data: null,
    });
  }
};

const getFileHistoryForUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    const allHistoryForUser = await historyService.fetchHistoryForUser(userId);

    return res.status(200).json({
      status: 'success',
      message: 'History for given user fetched successfully',
      data: allHistoryForUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: `An error occurred while fetching history for given user - ${error}`,
      data: null,
    });
  }
};

export { getFileHistory, getFileHistoryForUser };
