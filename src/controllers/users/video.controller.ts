import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import { Template, User, Video } from '../../models';
import {
  TextImageToVideoRequest,
  VideoGenerationByTextRequest,
} from '../../interfaces/IRapidApiinterface';
import { RapidApiService } from '../../services/rapidApi.service';
import { combineLeftRight } from '../../services/sharp.service';

export class VideoController {
  private readonly rapidApiService: RapidApiService;
  constructor() {
    this.rapidApiService = new RapidApiService();
  }

  /*
        {
            templateId: "",
            useOnlyPrompt: true,
            prompt: "",
            files: []
      }
  */
  public async generate(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body;
      console.error('Payload:', payload);
      if (!payload.templateId && !payload.useOnlyPrompt) {
        ResponseHandler.error(res, {
          msg: 'Please provide either prompt or select template',
        });
        return;
      }
      if (Number(req.user?.credits) <= 0) {
        ResponseHandler.error(res, {
          msg: "You don't have enough credits to generate video. Please buy some credits.",
        });
        return;
      }
      const files = req.files as Express.Multer.File[];

      const paths = files.map((file) => file.path);
      console.log(req.file);
      console.error(req.files);
      console.log(req.files);
      console.log(payload);
      if (payload.templateId && payload.useOnlyPrompt == "false") {
        console.error('Generating with template');
        const template = await Template.findOne({ _id: payload.templateId });
        if (!template) {
          ResponseHandler.error(res, {
            msg: 'Please provide either prompt or select template',
          });
          return;
        }
        console.error('Generating with template =-=-= ', template);
        if (template.inputType == 'image') {
          const payloadData: TextImageToVideoRequest = {
            text_prompt: template.prompt,
            model: 'gen3',
            image_as_end_frame: false,
            flip: false,
            motion: 5,
            seed: 0,
            callback_url: '',
            time: 10,
            img_prompt: '',
          };
          console.error('Paths:', paths);
          console.error('payloadData=-=-=:', payloadData);
          // payloadData.img_prompt = "";
          payloadData.img_prompt =
            paths.length > 1 ? paths.join(",") : paths.length == 1 ? paths[0] : '';
          if(paths.length > 1){
            const url = await combineLeftRight(paths);
            payloadData.img_prompt = url;
          }else{
            payloadData.img_prompt = paths.length == 1 ? paths[0] : '';
          }

          console.log('Payload Data', payloadData);
          console.error('Payload Data', payloadData);
          const response =
            await this.rapidApiService.generateImageTextToVideo(payloadData);
          await Video.create({
            userId: req.user?._id,
            templateId: payload.templateId,
            prompt: payload.prompt,
            progress: 0,
            uuid: response.uuid,
            inputImages: paths,
            url: null,
            gifUrl: null,
            status: 1,
          });
          await User.updateOne(
            { _id: req.user?._id },
            { $inc: { credits: -1 } },
          );
          ResponseHandler.success(res, {
            msg: 'Video generation has been queued successfully!',
            data: response,
          });
          return;
        } else {
          const payloadData: VideoGenerationByTextRequest = {
            text_prompt: payload.prompt,
            model: 'gen3',
            width: 1344,
            height: 768,
            motion: 5,
            seed: 0,
            callback_url: '',
            time: 10,
          };

          const response =
            await this.rapidApiService.generateVideoByText(payloadData);
          await Video.create({
            userId: req.user?._id,
            templateId: null,
            prompt: payload.prompt,
            progress: 0,
            uuid: response.uuid,
            url: null,
            gifUrl: null,
            status: 1,
          });
          await User.updateOne(
            { _id: req.user?._id },
            { $inc: { credits: -1 } },
          );
          ResponseHandler.success(res, {
            msg: 'Video generation has been queued successfully!',
            data: response,
          });
          return;
        }
      } else {
        const payloadData: VideoGenerationByTextRequest = {
          text_prompt: payload.prompt,
          model: 'gen3',
          width: 1344,
          height: 768,
          motion: 5,
          seed: 0,
          callback_url: '',
          time: 10,
        };
        const response =
          await this.rapidApiService.generateVideoByText(payloadData);
        await Video.create({
          userId: req.user?._id,
          templateId: null,
          prompt: payload.prompt,
          progress: 0,
          uuid: response.uuid,
          url: null,
          gifUrl: null,
          status: 1,
        });
        await User.updateOne({ _id: req.user?._id }, { $inc: { credits: -1 } });
        ResponseHandler.success(res, {
          msg: 'Video generation has been queued successfully!',
          data: response,
        });
        return;
      }
    } catch (error) {
      console.error('Error in video generation:', req.body);
      logError(`/api/v1/users/videos`, 'POST', error as Error);
      ResponseHandler.error(res, {
        msg: 'Video generation failed!!',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async getVideoStatusById(req: Request, res: Response): Promise<void> {
    try {
      const { uuid } = req.params;
      const videoData = await Video.findOne({ uuid: uuid });
      if (videoData?.userId?.toString() != req.user?._id?.toString()) {
        ResponseHandler.error(res, {
          msg: 'Please provide valid id',
        });
        return;
      }
      if (videoData?.status == 1) {
        const response = await this.rapidApiService.getTaskStatusById(uuid);
        const payload = {
          progress: response.progress * 100,
          url: '',
          gifUrl: '',
          status: videoData?.status,
        };
        if (response.url) {
          payload.url = response.url;
          payload.gifUrl = response.gif_url;
          payload.status = 2;
        }
        if (response.status === 'failed') {
          payload.status = 3;
        }
        await Video.updateOne({ uuid: response.uuid }, { $set: payload });
      }
      const video = await Video.findOne({ uuid: uuid }).populate('templateId');

      ResponseHandler.success(res, {
        msg: 'Video data fetched successfully',
        data: video,
      });
      return;
    } catch (error) {
      logError(`/api/v1/users/video/{uuid}`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Error while fetching video',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async gallery(req: Request, res: Response): Promise<void> {
    try {
      let { page = 1, limit = 10 } = req.query;
      limit = Number(limit);
      page = Number(page);
      const skip = (page - 1) * limit;
      const videos = await Video.find({ userId: req.user?._id })
        .populate("templateId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const total = await Video.countDocuments({ userId: req.user?._id });
      ResponseHandler.success(res, {
        msg: 'Gallery data fetched successfully',
        data: {
          total,
          data: videos,
        },
      });
      return;
    } catch (error) {
      logError(`/api/v1/users/video/gallery`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Error while fetching gallery data',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async rapidApiWebhook(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body;
      console.log('Webhook called');
      console.log(payload);
      const video = await Video.findOne({ uuid: payload.uuid });
      if (!video) {
        ResponseHandler.error(res, {
          msg: 'Video not found',
          statusCode: 404,
        });
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
        progress: payload.progress,
      };
      if (payload.status == 'completed' || payload.status == 'success') {
        updateData.status = 2;
        updateData.url = payload.url;
        updateData.gifUrl = payload.gif_url;
      } else if (payload.status == 'failed') {
        updateData.status = 3;
      }
      await Video.updateOne({ uuid: payload.uuid }, { $set: updateData });
      ResponseHandler.success(res, {
        msg: 'Video data fetched successfully',
        data: null,
      });
      return;
    } catch (error) {
      ResponseHandler.error(res, {
        msg: 'Error while fetching video',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }
}
