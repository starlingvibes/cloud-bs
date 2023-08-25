import express, { Express, Request, Response } from 'express';
import authRouter from './routes/auth.route';
const dotenv = require('dotenv');

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use('/api/v1/auth', authRouter);
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Cloud Backup API built with Node.js, Express, and TypeScript');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
