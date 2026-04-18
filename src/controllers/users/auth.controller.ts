import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import {
  User,
} from '../../models';

export class AuthController {
  constructor() {
  }
  public async register(req: Request, res: Response): Promise<void> {
    try {
      let user = await User.findOne({ authId: req.authUser?.sub });
      if(!user){
        user = await User.create({
            email: req.authUser?.email,
            profilePicture: req.authUser?.picture,
            name: req.authUser?.name,
            authId: req.authUser?.sub,
        });
      }

      ResponseHandler.success(res, {
        msg: 'User registered successfully',
        data: user,
      });
    } catch (error) {
      logError(`/api/v1/users/auth/register`, 'POST', error as Error);
      ResponseHandler.error(res, {
        msg: 'Registration failed',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async getUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne({ authId: req.authUser?.sub });

      ResponseHandler.success(res, {
        msg: 'User fetched successfully',
        data: user,
      });
    } catch (error) {
      logError(`/api/v1/users/auth/get-user`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Registration failed',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }
  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne({ authId: req.authUser?.sub });

      await User.updateOne({ _id: user?._id }, { isDeleted: true });

      ResponseHandler.success(res, {
        msg: 'User fetched successfully',
        data: user,
      });
    } catch (error) {
      logError(`/api/v1/users/auth/get-user`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Registration failed',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }
}
