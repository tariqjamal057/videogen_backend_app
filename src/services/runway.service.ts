import axios, { AxiosInstance } from 'axios';
import { ImageToVideoRequest, TextImageToVideoRequest, VideoGenerationByTextRequest, VideoGenerationStatusResponse, VideoQueueResponse } from '../interfaces/IRapidApiinterface';
import { Config } from '../config';

export class RunwayService {
    private readonly axiosInstance: AxiosInstance;
    constructor(){
        this.axiosInstance = axios.create({
            baseURL: 'https://api.runwayml.com/v1',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer key_a8602bcb0cb4d424e5fccaf24fd22e068dc232cdde173f44196654c3da842e58104bc99437ac915d9d37eb23da760a0b50b3f156013a0b2da4e3e36ba83347b1`,
              'X-Runway-Version': '2024-11-06'
            }
          });
    }

    public async generateVideoByText(payload: VideoGenerationByTextRequest): Promise<VideoQueueResponse> {
        // Direct RunwayML API might have different endpoint and payload structure than RapidAPI proxy
        // Adapting to typical direct API structure if different
        const runwayPayload = {
            taskType: "text_to_video",
            model: payload.model === 'gen3' ? "gen3a_turbo" : payload.model,
            promptText: payload.text_prompt,
            watermark: false,
            width: payload.width,
            height: payload.height,
        };
        const resp = await this.axiosInstance.post("/tasks", runwayPayload);
        return {
            uuid: resp.data.id,
            status: resp.data.status
        };
    }

    public async generateImageToVideo(payload: ImageToVideoRequest): Promise<VideoQueueResponse> {
        const runwayPayload = {
            taskType: "image_to_video",
            model: payload.model === 'gen3' ? "gen3a_turbo" : payload.model,
            promptImage: Array.isArray(payload.img_prompt) ? payload.img_prompt[0] : payload.img_prompt,
            watermark: false,
        };
        const resp = await this.axiosInstance.post("/tasks", runwayPayload);
        return {
            uuid: resp.data.id,
            status: resp.data.status
        };
    }

    public async generateImageTextToVideo(payload: TextImageToVideoRequest): Promise<VideoQueueResponse> {
        const runwayPayload = {
            taskType: "image_to_video",
            model: payload.model === 'gen3' ? "gen3a_turbo" : payload.model,
            promptText: payload.text_prompt,
            promptImage: Array.isArray(payload.img_prompt) ? payload.img_prompt[0] : payload.img_prompt,
            watermark: false,
        };
        const resp = await this.axiosInstance.post("/tasks", runwayPayload);
        return {
            uuid: resp.data.id,
            status: resp.data.status
        };
    }

    public async getTaskStatusById(uuid: string): Promise<VideoGenerationStatusResponse> {
        const resp = await this.axiosInstance.get(`/tasks/${uuid}`);
        return {
            uuid: resp.data.id,
            status: resp.data.status,
            progress: resp.data.progress || 0,
            url: resp.data.output?.[0] || '',
            gif_url: resp.data.output?.[0] || '' // Runway direct might not provide separate gif
        };
    }
}
