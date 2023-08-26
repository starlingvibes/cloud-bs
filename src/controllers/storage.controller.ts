const processUploadedFile = require('../middlewares/processFile.middleware');
const { format } = require('util');
const { Storage } = require('@google-cloud/storage');
const uuid = require('uuid');
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { File } from '../entity/File';
import { UserService } from '../services/user.service';

// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: 'storage-keys.json' });
const bucket = storage.bucket('cloud_backupsys');

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
      await fileRepository.save(newFile);

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

const download = async (req: Request, res: Response) => {
  try {
    const [metaData] = await bucket.file(req.params.name).getMetadata();
    res.redirect(metaData.mediaLink);
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Could not download the file. ' + err,
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

const markUnsafeAndDelete = async (req: Request, res: Response) => {
  const fileId = parseInt(req.params.id, 10);

  try {
    const fileRepository = AppDataSource.getRepository(File);
    const file = await fileRepository.findOne({ where: { id: fileId } });

    if (!file) {
      throw new Error('File not found!');
    }

    file.isUnsafe = true;
    await bucket.file(file.fileName).delete();
    await fileRepository.save(file);

    return res.status(200).json({
      status: 'success',
      message: 'File deleted successfully!',
      data: null,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Could not delete the file. ' + err,
      data: null,
    });
  }
};

module.exports = { upload, download, markUnsafeAndDelete, createFolder };
