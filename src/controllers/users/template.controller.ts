import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import { Category, Template } from '../../models';

export class TemplateController {
  constructor() {
  }
  public async getTemplates(req: Request, res: Response): Promise<void> {
    try {
      const templates = await Category.aggregate([
        {
            $lookup: {
              from: 'templates',
              localField: '_id',
              foreignField: 'categoryId',
              as: 'templates',
            },
          },
      ])
      ResponseHandler.success(res, {
        msg: 'Templates fetched successfully',
        data: templates,
      });
    } catch (error) {
      logError(`/api/v1/users/templates/`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Registration failed',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async topTemplates(req: Request, res: Response): Promise<void> {
    try {
      let { limit = 4 } = req.query;
      limit = Number(limit);
      const templates = await Template.find({}).sort({ createdAt: -1 }).limit(limit);
      ResponseHandler.success(res, {
        msg: 'Templates fetched successfully',
        data: templates,
      });
    } catch (error) {
      logError(`/api/v1/users/templates/`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Registration failed',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }
}
