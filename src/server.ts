import express, { Express, Request, Response } from 'express';
import authRouter from './routes/auth.route';
import storageRouter from './routes/storage.route';
const dotenv = require('dotenv');

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use('/api/v1/auth', authRouter);
// TODO: Implement AUthMiddleware
app.use('/api/v1/storage', storageRouter);

const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Cloud Backup API built with Node.js, Express, and TypeScript');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
