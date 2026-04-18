import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import {
    Video,
} from '../../models';

export class VideoController {
  public async index(req: Request, res: Response): Promise<void> {
    try {
        const videos = await Video.find().populate('userId', 'name email image').populate('templateId', 'name prompt image');
      ResponseHandler.success(res, {
        msg: 'Video listed successfully',
        data: videos,
      });
    } catch (error) {
      logError(`/api/v1/admins/videos`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async deleteVideo(req: Request, res: Response): Promise<void> {
    try {
      const video = await Video.findOne({
        _id: req.params.id,
      });
      if(!video) {
        ResponseHandler.error(res, {
          msg: 'Video not found',
          statusCode: 404,
        });
        return;
      }
      await video.deleteOne();

      ResponseHandler.success(res, {
        msg: 'Video deleted successfully',
        data: null,
      });
    } catch (error) {
      logError(`/api/v1/admins/videos/:id`, 'DELETE', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }
}
