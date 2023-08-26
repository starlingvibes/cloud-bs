import express, { Express, Request, Response } from 'express';
import authRouter from './routes/auth.route';
import storageRouter from './routes/storage.route';
const dotenv = require('dotenv');

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/storage', storageRouter);

const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'success',
    message:
      'Cloud Backup API built with Node.js, Express, Google Cloud, PostgreSQL, and TypeScript',
    data: null,
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
