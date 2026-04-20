import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import { Template, User, Video } from '../../models';
import {
  TextImageToVideoRequest,
  VideoGenerationByTextRequest,
} from '../../interfaces/IRapidApiinterface';
import { RunwayService } from '../../services/runway.service';
import { StabilityService } from '../../services/stability.service';
import { combineLeftRight } from '../../services/sharp.service';
import fs from 'fs';

export class VideoController {
  private readonly runwayService: RunwayService;
  private readonly stabilityService: StabilityService;
  constructor() {
    this.runwayService = new RunwayService();
    this.stabilityService = new StabilityService();
  }

  public async generate(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body;
      const isAiVideoTab = req.query.isAiVideoTab === 'true';
      const files = req.files as Express.Multer.File[];
      const localPaths = files ? files.map((file) => file.path) : [];

      if (!payload.templateId && !payload.prompt) {
        ResponseHandler.error(res, {
          msg: 'Please provide either prompt or select template',
        });
        return;
      }

      if (Number(req.user?.credits) <= 0) {
        ResponseHandler.error(res, {
          msg: "You don't have enough credits to generate. Please buy some credits.",
        });
        return;
      }

      let template = null;
      if (payload.templateId && payload.useOnlyPrompt === "false") {
        template = await Template.findOne({ _id: payload.templateId });
        if (!template) {
          ResponseHandler.error(res, {
            msg: 'Template not found',
          });
          return;
        }
      }

      // Determine if this is an image or video generation request
      const isImageRequest = isAiVideoTab || (template && template.templateType === 'image');

      if (isImageRequest) {
        // IMAGE GENERATION
        const imagePath = localPaths.length > 0 ? localPaths[0] : null;
        const finalPrompt = template ? (`${template.prompt}, ${payload.prompt}`) : payload.prompt;
        
        const response = await this.stabilityService.generateImage(finalPrompt, imagePath);
        
        const video = await Video.create({
          userId: req.user?._id,
          templateId: template?._id || null,
          prompt: payload.prompt,
          progress: 100,
          uuid: `img_${Date.now()}`,
          url: response.url,
          gifUrl: response.url,
          status: 2,
        });
        
        await User.updateOne({ _id: req.user?._id }, { $inc: { credits: -1 } });
        
        ResponseHandler.success(res, {
          msg: 'Image generated successfully!',
          data: video,
        });
        return;
      } else {
        // VIDEO GENERATION
        let response;
        
        // For video generation, we need to upload files to Cloudinary first because Runway needs URLs
        const cloudinaryUrls = [];
        for(const path of localPaths) {
           const url = await this.stabilityService.uploadToCloudinary(path);
           cloudinaryUrls.push(url);
           // Delete local file after upload to Cloudinary
           if (fs.existsSync(path)) fs.unlinkSync(path);
        }

        if (template && template.inputType === 'image') {
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
          
          if(cloudinaryUrls.length > 1){
            // combineLeftRight currently expects local paths, let's keep it simple for now and use first image
            // OR we could have kept local paths just for this.
            payloadData.img_prompt = cloudinaryUrls[0]; 
          } else {
            payloadData.img_prompt = cloudinaryUrls.length == 1 ? cloudinaryUrls[0] : '';
          }
          response = await this.runwayService.generateImageTextToVideo(payloadData);
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
          response = await this.runwayService.generateVideoByText(payloadData);
        }

        await Video.create({
          userId: req.user?._id,
          templateId: template?._id || null,
          prompt: payload.prompt,
          progress: 0,
          uuid: response.uuid,
          inputImages: cloudinaryUrls,
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
      logError(`/api/v1/users/videos/generate`, 'POST', error as Error);
      ResponseHandler.error(res, {
        msg: 'Generation failed!!',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async getVideoStatusById(req: Request, res: Response): Promise<void> {
    try {
      const uuid = req.params.uuid as string;
      const videoData = await Video.findOne({ uuid: uuid });
      if (videoData?.userId?.toString() != req.user?._id?.toString()) {
        ResponseHandler.error(res, {
          msg: 'Please provide valid id',
        });
        return;
      }
      if (videoData?.status == 1) {
        const response = await this.runwayService.getTaskStatusById(uuid);
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
        msg: 'Generation data fetched successfully',
        data: video,
      });
      return;
    } catch (error) {
      logError(`/api/v1/users/video/{uuid}`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Error while fetching data',
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