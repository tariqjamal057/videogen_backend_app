import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import {
    Report,
} from '../../models';

export class ReportController {
  public async index(req: Request, res: Response): Promise<void> {
    try {
        const reports = await Report.find().populate('userId', 'name email image').populate('videoId', '_id uuid');
      ResponseHandler.success(res, {
        msg: 'Report listed successfully',
        data: reports,
      });
    } catch (error) {
      logError(`/api/v1/admins/reports`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }
}
