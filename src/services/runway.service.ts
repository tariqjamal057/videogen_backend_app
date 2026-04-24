import axios, { AxiosInstance } from 'axios';
import { Config } from '../config';

export interface RunwayVideoQueueResponse {
  id: string;
}

export interface RunwayTaskStatusResponse {
  id: string;
  status: string;
  progress?: number;
  output?: string[];
  error?: string;
}

export class RunwayService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.dev.runwayml.com/v1',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Config.RUNWAYML_API_KEY}`,
        'X-Runway-Version': '2024-11-06'
      }
    });
  }

  public async generateVideoByText(payload: {
    promptText: string;
    ratio: string;
    duration: number;
    model?: string;
    seed?: number;
  }): Promise<RunwayVideoQueueResponse> {
    const runwayPayload = {
      promptText: payload.promptText,
      ratio: payload.ratio || "720:1280",
      duration: payload.duration,
      seed: payload.seed || Math.floor(Math.random() * 4294967295),
      model: payload.model || "gen4.5",
      contentModeration: {
        publicFigureThreshold: "auto"
      }
    };
    console.log("Text to video is called ")
    const resp = await this.axiosInstance.post("/text_to_video", runwayPayload);
    return resp.data;
  }

  public async generateImageToVideo(payload: {
    promptText: string;
    promptImage: string | string[];
    ratio: string;
    duration: number;
    model?: string;
    seed?: number;
  }): Promise<RunwayVideoQueueResponse> {
    let promptImage: any = payload.promptImage;
    let isDoubleImage = false;

    if (Array.isArray(payload.promptImage)) {
      if (payload.promptImage.length > 1) {
        isDoubleImage = true;
        promptImage = [
          { uri: payload.promptImage[0], position: "first" },
          { uri: payload.promptImage[1], position: "last" }
        ];
      } else if (payload.promptImage.length === 1) {
        promptImage = payload.promptImage[0];
      }
    }

    // Model selection logic
    const model = isDoubleImage ? "veo3.1" : "gen4.5";

    // Duration mapping logic
    let mappedDuration = payload.duration;
    if (!isDoubleImage) {
      // Single Image (gen4.5)
      if (payload.duration === 10) mappedDuration = 8;
      else if (payload.duration === 15) mappedDuration = 10;
    } else {
      // Double Image (veo3.1)
      if (payload.duration === 10) mappedDuration = 6;
      else if (payload.duration === 15) mappedDuration = 8;
      else if (payload.duration === 5) mappedDuration = 4;
    }

    const runwayPayload = {
      promptText: payload.promptText,
      promptImage: promptImage,
      ratio: payload.ratio || "720:1280",
      duration: mappedDuration,
      seed: payload.seed || Math.floor(Math.random() * 4294967295),
      model: model,
      contentModeration: {
        publicFigureThreshold: "auto"
      }
    };
    console.log("Image to video is called")
    const resp = await this.axiosInstance.post("/image_to_video", runwayPayload);
    return resp.data;
  }

  public async generateVideoToVideo(payload: {
    videoUri: string;
    promptText: string;
    seed?: number;
    model?: string;
    ratio?: string;
  }): Promise<RunwayVideoQueueResponse> {
    const runwayPayload = {
      videoUri: payload.videoUri,
      promptText: payload.promptText,
      seed: payload.seed || Math.floor(Math.random() * 4294967295),
      model: payload.model || "gen4_aleph",
      ratio: payload.ratio || "720:1280", // Deprecated but included in curl examples
      contentModeration: {
        publicFigureThreshold: "auto"
      }
    };
    console.log("Video to video is called")
    const resp = await this.axiosInstance.post("/video_to_video", runwayPayload);
    return resp.data;
  }

  public async getTaskStatusById(id: string): Promise<RunwayTaskStatusResponse> {
    const resp = await this.axiosInstance.get(`/tasks/${id}`);
    return resp.data;
  }
}
