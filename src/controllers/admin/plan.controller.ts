import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import {
    Plan,
} from '../../models';

export class PlanController {
  public async index(req: Request, res: Response): Promise<void> {
    try {
        const plans = await Plan.find();
      ResponseHandler.success(res, {
        msg: 'Plans listed successfully',
        data: plans,
      });
    } catch (error) {
      logError(`/api/v1/admins/plans`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const plan = await Plan.findOne({ _id: req.params.id });
        if(!plan){
            ResponseHandler.error(res, {
                msg: 'Plan not found',
                statusCode: 404,
            });
            return;
        }

      ResponseHandler.success(res, {
        msg: 'Plan fetched successfully',
        data: plan,
      });
    } catch (error) {
      logError(`/api/v1/admins/plans/:id`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
        const payload = req.body;
      const plan = await Plan.create(payload);

      ResponseHandler.success(res, {
        msg: 'Plan created successfully',
        data: plan,
      });
    } catch (error) {
      logError(`/api/v1/admins/plans`, 'POST', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const plan = await Plan.findOne({
        _id: req.params.id,
      });
      if(!plan) {
        ResponseHandler.error(res, {
          msg: 'Plan not found',
          statusCode: 404,
        });
        return;
      }

      await Plan.updateOne({ _id: req.params.id }, { $set: req.body });

      ResponseHandler.success(res, {
        msg: 'Plan updated successfully',
        data: plan,
      });
    } catch (error) {
      logError(`/api/v1/admins/plans/:id`, 'PUT', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async deletePlan(req: Request, res: Response): Promise<void> {
    try {
      const plan = await Plan.findOne({
        _id: req.params.id,
      });
      if(!plan) {
        ResponseHandler.error(res, {
          msg: 'Plan not found',
          statusCode: 404,
        });
        return;
      }
      await plan.deleteOne();

      ResponseHandler.success(res, {
        msg: 'Plan deleted successfully',
        data: null,
      });
    } catch (error) {
      logError(`/api/v1/admins/plans/:id`, 'DELETE', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }
}
