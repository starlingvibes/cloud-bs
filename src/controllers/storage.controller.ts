const processUploadedFile = require('../middlewares/processFile.middleware');
const { format } = require('util');
const { Storage } = require('@google-cloud/storage');
const uuid = require('uuid');
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { File } from '../entity/File';
import { UserService } from '../services/user.service';
import { History } from '../entity/History';
import { HistoryService } from '../services/history.service';

// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: 'storage-keys.json' });
const bucket = storage.bucket('cloud_backupsys');

// TODO: @lowpriority - refactor this to use a storage service
const upload = async (req, res) => {
  try {
    await processUploadedFile(req, res);
    const newFile = new File();
    const userService = new UserService();
    const user = await userService.findById(req.userData.userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (!req.file) {
      throw new Error('Please upload a file!');
    }

    // Create a new blob in the bucket and upload the file data.
    // let uniquename = `${req.file.fieldname}-${uuid.v4()}-${
    //   req.file.originalname
    // }`;

    // creating a directory for each user
    // TODO: create a type to access req.userData et al
    const userRootDir = `${req.userData.fullName
      .replace(/\s/g, '')
      .toLowerCase()}${req.userData.userId}`;

    const blob = bucket.file(`${userRootDir}/${req.file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      throw new Error(err);
    });

    // eslint-disable-next-line no-unused-vars
    blobStream.on('finish', async (data) => {
      // Create URL for directly file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
      newFile.fileName = `${userRootDir}/${req.file.originalname}`;
      newFile.path = publicUrl;
      newFile.user = user;

      const fileRepository = AppDataSource.getRepository(File);
      const historyService = new HistoryService();

      await fileRepository.save(newFile);
      await historyService.createHistory(
        user,
        `${userRootDir}/${req.file.originalname}`,
        'CREATE'
      );

      try {
        // Make the file public
        await bucket.file(req.file.originalname).makePublic();
      } catch (err) {
        console.log(err);

        return res.status(200).json({
          status: 'success',
          message: `Uploaded the file successfully: ${req.file.originalname}`,
          data: {
            url: publicUrl,
          },
        });
      }
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File cannot be larger than 200MB',
        data: null,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: `Could not upload the file - ${err.message}`,
      data: null,
    });
  }
};

const download = async (req: any, res: any) => {
  try {
    const userService = new UserService();
    const user = await userService.findById(req.userData.userId);
    const fileName = req.params.fileName;
    const folderName = req.params.folderName;
    const userRootDir = `${req.userData.fullName
      .replace(/\s/g, '')
      .toLowerCase()}${req.userData.userId}`;
    const historyService = new HistoryService();

    const filePath = folderName
      ? `${userRootDir}/${folderName}/${fileName}`
      : `${userRootDir}/${fileName}`;

    const [metaData] = await bucket.file(filePath).getMetadata();

    await historyService.createHistory(user, filePath, 'DOWNLOAD');

    res.redirect(metaData.mediaLink);
    return {
      status: 'success',
      message: 'File downloaded successfully, navigate to the link below',
      data: metaData.mediaLink,
    };
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Could not download the file. ' + err,
      data: null,
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const userService = new UserService();
    const user = await userService.findById(req.userData.userId);
    const fileRepository = AppDataSource.getRepository(File);
    const { fileName } = req.params;
    const userRootDir = `${req.userData.fullName
      .replace(/\s/g, '')
      .toLowerCase()}${req.userData.userId}`;
    const file = await fileRepository.findOne({
      where: { fileName: `${userRootDir}/${fileName}` },
    });
    console.log(file);
    // const userRootDir = `${req.userData.fullName
    //   .replace(/\s/g, '')
    //   .toLowerCase()}${req.userData.userId}`;

    if (!file) {
      throw new Error('File not found!');
    }

    const historyService = new HistoryService();

    await bucket.file(`${file.fileName}`).delete();
    await historyService.createHistory(user, `${file.fileName}`, 'DELETE');
    await fileRepository.delete(file.id);

    return res.status(200).json({
      status: 'success',
      message: 'File deleted successfully!',
      data: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: `Could not delete the file - ${error}`,
      data: null,
    });
  }
};

const listFiles = async (req, res) => {
  try {
    const userRootDir = `${req.userData.fullName
      .replace(/\s/g, '')
      .toLowerCase()}${req.userData.userId}`;

    const options = {
      prefix: userRootDir,
    };

    // only list files in the user's root directory
    const [files] = await bucket.getFiles(options);
    const fileList = files.map((file) => {
      return {
        fileName: file.name,
        fileSize: file.size,
        fileOwner: file.metadata.owner,
        fileCreated: file.metadata.timeCreated,
      };
    });

    return res.status(200).json({
      status: 'success',
      message: 'Files retrieved successfully!',
      data: fileList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: `Could not retrieve files - ${error}`,
      data: null,
    });
  }
};

const fetchAllFiles = async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    const fileList = files.map((file) => {
      return {
        fileName: file.name,
        fileSize: file.size,
        fileOwner: file.metadata.owner,
        fileCreated: file.metadata.timeCreated,
      };
    });

    return res.status(200).json({
      status: 'success',
      message: 'Files retrieved successfully!',
      data: fileList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: `Could not retrieve files - ${error}`,
      data: null,
    });
  }
};

const createFolder = async (req, res) => {
  try {
    const userService = new UserService();
    const user = await userService.findById(req.userData.userId);

    if (!user) {
      throw new Error("User doesn't exist!");
    }

    const { folderName } = req.body;

    if (!folderName) {
      throw new Error('Please provide a folder name!');
    }

    if (folderName.startsWith('/') || folderName.endsWith('/')) {
      throw new Error(
        'Folder name should not start nor end with a forward slash!'
      );
    }

    const userRootDir = `${req.userData.fullName
      .replace(/\s/g, '')
      .toLowerCase()}${req.userData.userId}`;

    const folderExists = await bucket
      .file(`${userRootDir}/${folderName}`)
      .exists();

    if (folderExists[0]) {
      throw new Error('Folder already exists!');
    }

    const folderFile = bucket.file(`${userRootDir}/${folderName}/.keep`);
    await folderFile.save('');

    return res.status(201).json({
      status: 'success',
      message: 'Folder created successfully!',
      data: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: `Could not create the folder - ${error}`,
      data: null,
    });
  }
};

const markUnsafeAndDelete = async (req: any, res: Response) => {
  const fileId = parseInt(req.params.id, 10);

  try {
    const fileRepository = AppDataSource.getRepository(File);
    const file = await fileRepository.findOne({ where: { id: fileId } });

    if (!file) {
      throw new Error('File not found!');
    }

    file.isUnsafe = true;

    // Multiple admin review for file to get deleted - 2 admins required
    if (file.isUnsafe && file.admin_id !== req.userData.userId) {
      await bucket.file(file.fileName).delete();
      await fileRepository.delete(file.id);

      return res.status(200).json({
        status: 'success',
        message: 'File marked as unsafe and deleted successfully!',
        data: null,
      });
    } else {
      file.admin_id = req.userData.userId;
      await fileRepository.save(file);

      return res.status(200).json({
        status: 'success',
        message: 'File successfully marked as unsafe',
        data: null,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Could not delete the file. ' + err,
      data: null,
    });
  }
};

export {
  upload,
  download,
  markUnsafeAndDelete,
  createFolder,
  deleteFile,
  listFiles,
  fetchAllFiles,
};
