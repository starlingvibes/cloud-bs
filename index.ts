// const express = require('express');
import express, { Express, Request, Response } from 'express';
const dotenv = require('dotenv');

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Cloud Backup API built with Node.js, Express, and TypeScript');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
