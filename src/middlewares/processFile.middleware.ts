const util = require('util');
const Multer = require('multer');
const path = require('path');
const maxSize = 200 * 1024 * 1024;

let processFile = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: maxSize },
}).single('file');

let processFileMiddleware = util.promisify(processFile);
module.exports = processFileMiddleware;
