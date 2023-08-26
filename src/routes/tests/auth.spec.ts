import express, { Request, Response, NextFunction } from 'express';
import authRouter from '../auth.route';
import request from 'supertest';
import { register, login } from '../../controllers/auth.controller';

jest.mock('../../controllers/auth.controller', () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

const app = express();
app.use('/', authRouter);

describe('Authentication routes for the application', () => {
  it('should call register function when POST /register', async () => {
    (register as jest.Mock).mockImplementationOnce(
      (req: Request, res: Response) => {
        res.send('register');
      }
    );

    const response = await request(app).post('/register');
    expect(response.status).toBe(200);
    expect(register).toHaveBeenCalled();
  });

  it('should call login function when POST /login', async () => {
    (login as jest.Mock).mockImplementationOnce(
      (req: Request, res: Response) => {
        res.send('login');
      }
    );

    const response = await request(app).post('/login');
    expect(response.status).toBe(200);
    expect(response.text).toBe('login');
    expect(login).toHaveBeenCalled();
  });
});
