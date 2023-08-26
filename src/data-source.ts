import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { File } from './entity/File';
const dotenv = require('dotenv');

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, File],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(async () => {
    console.log('Connection to database established.');
  })
  .catch((error) => console.log(error));
