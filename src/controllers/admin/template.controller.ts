import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import {
    Template,
} from '../../models';

export class TemplateController {
  public async index(req: Request, res: Response): Promise<void> {
    try {
        const templates = await Template.find().populate('categoryId');
      ResponseHandler.success(res, {
        msg: 'Template listed successfully',
        data: templates,
      });
    } catch (error) {
      logError(`/api/v1/admins/templates`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const template = await Template.findOne({ _id: req.params.id }).populate('categoryId');
        if(!template){
            ResponseHandler.error(res, {
                msg: 'Template not found',
                statusCode: 404,
            });
            return;
        }

      ResponseHandler.success(res, {
        msg: 'Template fetched successfully',
        data: template,
      });
    } catch (error) {
      logError(`/api/v1/admins/templates/:id`, 'GET', error as Error);
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
      if(req.file){
        payload.image = req.file?.path;
      }
      const template = await Template.create(payload);

      ResponseHandler.success(res, {
        msg: 'Template created successfully',
        data: template,
      });
    } catch (error) {
      logError(`/api/v1/admins/templates`, 'POST', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const template = await Template.findOne({
        _id: req.params.id,
      });
      console.log(req.file);
      if(!template) {
        ResponseHandler.error(res, {
          msg: 'Template not found',
          statusCode: 404,
        });
        return;
      }
      const payload = req.body;
      if(req.file){
        payload.image = req.file?.path;
      }

      await Template.updateOne({ _id: req.params.id }, { $set: payload });

      ResponseHandler.success(res, {
        msg: 'Template updated successfully',
        data: template,
      });
    } catch (error) {
      logError(`/api/v1/admins/templates/:id`, 'PUT', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async deleteTemplate(req: Request, res: Response): Promise<void> {
    try {
      const template = await Template.findOne({
        _id: req.params.id,
      });
      if(!template) {
        ResponseHandler.error(res, {
          msg: 'Plan not found',
          statusCode: 404,
        });
        return;
      }
      await template.deleteOne();

      ResponseHandler.success(res, {
        msg: 'Template deleted successfully',
        data: null,
      });
    } catch (error) {
      logError(`/api/v1/admins/templates/:id`, 'DELETE', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }
}
