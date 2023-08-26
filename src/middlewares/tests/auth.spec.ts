import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyUser } from '../auth.middleware';

const userSecretKey = process.env.JWT_SECRET_USER || '';
const adminSecretKey = process.env.JWT_SECRET_ADMIN || '';

jest.mock('jsonwebtoken');

describe('Authentication Middleware Tests', () => {
  let mockReq: any = {};
  let mockRes: any = { sendStatus: jest.fn() };
  let mockNext: NextFunction = jest.fn();

  //   beforeEach(() => {
  //     mockReq = {} as Request;
  //     mockRes = {} as Response;
  //     mockNext = jest.fn();
  //   });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send 401 on invalid token', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error();
    });

    mockReq.headers = { authorization: 'Bearer invalid-token' };

    await verifyUser(mockRes, mockRes, mockNext);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should throw 401 error if no authorization header is provided', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error();
    });

    mockReq.headers = {};

    await verifyUser(mockRes, mockRes, mockNext);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should throw 401 error if no authorization token is missing', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error();
    });

    mockReq.headers = { authorization: '' };

    await verifyUser(mockRes, mockRes, mockNext);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should verify and set userData on valid token', async () => {
    const mockDecoded = { id: 5 };
    jwt.verify.mockReturnValue(mockDecoded);

    mockReq.headers = { authorization: 'Bearer valid-token' };

    await verifyUser(mockReq, mockRes, mockNext);

    expect(mockReq.userData).toEqual(mockDecoded);
    expect(mockNext).toHaveBeenCalled();
  });

  //   it('should throw Unauthenticated error if the verify method of JWT throws an error', () => {
  //     mockReq.headers = { authorization: 'invalidToken' };
  //     jwt.verify = jest.fn().mockImplementation(() => {
  //       throw new Error('Invalid token');
  //     });

  //     expect(() => verifyUser(mockReq, mockRes, mockNext)).toHaveBeenCalledWith(
  //       401
  //     );
  //     expect(mockNext).not.toHaveBeenCalled();
  //   });
});
