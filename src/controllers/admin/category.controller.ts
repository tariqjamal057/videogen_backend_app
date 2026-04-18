import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import {
    Category,
} from '../../models';

export class CategoryController {
  public async index(req: Request, res: Response): Promise<void> {
    try {
        const categories = await Category.find();
      ResponseHandler.success(res, {
        msg: 'Categories listed successfully',
        data: categories,
      });
    } catch (error) {
      logError(`/api/v1/admins/category`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const category = await Category.findOne({ _id: req.params.id });
        if(!category){
            ResponseHandler.error(res, {
                msg: 'Category not found',
                statusCode: 404,
            });
            return;
        }

      ResponseHandler.success(res, {
        msg: 'Category fetched successfully',
        data: category,
      });
    } catch (error) {
      logError(`/api/v1/admins/category/:id`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const category = await Category.create({
        name: req.body.name,
      });

      ResponseHandler.success(res, {
        msg: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      logError(`/api/v1/admins/category`, 'POST', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const category = await Category.findOne({
        _id: req.params.id,
      });
      if(!category) {
        ResponseHandler.error(res, {
          msg: 'Category not found',
          statusCode: 404,
        });
        return;
      }

      category.name = req.body.name || category.name;

      await category.save();

      ResponseHandler.success(res, {
        msg: 'Category updated successfully',
        data: category,
      });
    } catch (error) {
      logError(`/api/v1/admins/category/:id`, 'PUT', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await Category.findOne({
        _id: req.params.id,
      });
      if(!category) {
        ResponseHandler.error(res, {
          msg: 'Category not found',
          statusCode: 404,
        });
        return;
      }
      await category.deleteOne();

      ResponseHandler.success(res, {
        msg: 'Category deleted successfully',
        data: null,
      });
    } catch (error) {
      logError(`/api/v1/admins/category/:id`, 'DELETE', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }
}
