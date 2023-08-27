import express, { Express, Request, Response } from 'express';
import authRouter from './routes/auth.route';
import storageRouter from './routes/storage.route';
import historyRouter from './routes/history.route';
// import { createClient } from 'redis';
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/storage', storageRouter);
app.use('/api/v1/history', historyRouter);

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
