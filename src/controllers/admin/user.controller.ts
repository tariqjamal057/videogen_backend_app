import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import {
    User,
} from '../../models';
import { firebase } from '../../services/firebase.service';

export class UserController {
  public async index(req: Request, res: Response): Promise<void> {
    try {
        const users = await User.find();
      ResponseHandler.success(res, {
        msg: 'User listed successfully',
        data: users,
      });
    } catch (error) {
      logError(`/api/v1/admins/users`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne({ _id: req.params.id });
        if(!user){
            ResponseHandler.error(res, {
                msg: 'Template not found',
                statusCode: 404,
            });
            return;
        }

      ResponseHandler.success(res, {
        msg: 'User fetched successfully',
        data: user,
      });
    } catch (error) {
      logError(`/api/v1/admins/users/:id`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async suspendAndActive(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne({
        _id: req.params.id,
      });
      if(!user) {
        ResponseHandler.error(res, {
          msg: 'User not found',
          statusCode: 404,
        });
        return;
      }

      let payload = {};
      let msg = "User Suspended successfully";
      if(user.isSuspended) {
        payload = { isSuspended: false };
        msg = "User Activated successfully";
      } else {
        payload = { isSuspended: true };
      }

      await User.updateOne({ _id: req.params.id }, { $set: payload });

      ResponseHandler.success(res, {
        msg: msg,
        data: user,
      });
    } catch (error) {
      logError(`/api/v1/admins/users/suspend-activate/:id`, 'PUT', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne({
        _id: req.params.id,
      });
      if(!user) {
        ResponseHandler.error(res, {
          msg: 'User not found',
          statusCode: 404,
        });
        return;
      }
      const payload = req.body;

      await User.updateOne({ _id: req.params.id }, { $set: payload });

      ResponseHandler.success(res, {
        msg: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      logError(`/api/v1/admins/users/:id`, 'PUT', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne({
        _id: req.params.id,
      });
      if(!user) {
        ResponseHandler.error(res, {
          msg: 'User not found',
          statusCode: 404,
        });
        return;
      }
      await user.deleteOne();
      await firebase.auth().deleteUser(user.authId);

      ResponseHandler.success(res, {
        msg: 'User deleted successfully',
        data: null,
      });
    } catch (error) {
      logError(`/api/v1/admins/users/:id`, 'DELETE', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }
}
