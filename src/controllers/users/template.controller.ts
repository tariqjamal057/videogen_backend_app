import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import { Category, Template } from '../../models';

export class TemplateController {
  constructor() {
  }
  public async getTemplates(req: Request, res: Response): Promise<void> {
    try {
      // Fetch categories with their associated templates
      const categoriesWithTemplates = await Category.aggregate([
        {
          $lookup: {
            from: 'templates',
            localField: '_id',
            foreignField: 'categoryId',
            as: 'templates',
          },
        },
        {
          $project: {
            name: 1,
            templates: {
              $sortArray: { input: '$templates', sortBy: { createdAt: -1 } }
            }
          }
        }
      ]);

      // Fetch video templates without categories (or null categoryId)
      const videoTemplates = await Template.find({ 
        templateType: 'video', 
        $or: [
          { categoryId: { $exists: false } },
          { categoryId: null }
        ]
      }).sort({ createdAt: -1 });

      const result = [...categoriesWithTemplates];
      
      if (videoTemplates.length > 0) {
        result.push({
          _id: 'video_category',
          name: 'Video',
          templates: videoTemplates
        });
      }

      ResponseHandler.success(res, {
        msg: 'Templates fetched successfully',
        data: result,
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
      // Ensure we get the latest templates
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
