import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import { Plan } from '../../models';

export class PlanController {
  constructor() {
  }
  public async getPlans(req: Request, res: Response): Promise<void> {
    try {
      const templates = await Plan.find();
      ResponseHandler.success(res, {
        msg: 'Plan fetched successfully',
        data: templates,
      });
    } catch (error) {
      logError(`/api/v1/users/plans`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Registration failed',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }
}
