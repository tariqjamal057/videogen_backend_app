import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import { Report } from '../../models';

export class ReportController {
  constructor() {
  }
  public async reportVideo(req: Request, res: Response): Promise<void> {
    try {
        const report = await Report.findOne({ userId: req.user?._id, videoId: req.body?.videoId });
        if(report){
            ResponseHandler.error(res, {
                msg: "You have already reported this video",
                statusCode: 400
            });
            return;
        }
        await Report.create({
            userId: req.user?._id,
            videoId: req.body.videoId,
            reason: req.body.reason,
        });
      ResponseHandler.success(res, {
        msg: 'Video Reported successfully',
        data: null,
      });
    } catch (error) {
      logError(`/api/v1/users/reports`, 'POST', error as Error);
      ResponseHandler.error(res, {
        msg: 'Registration failed',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }
}
