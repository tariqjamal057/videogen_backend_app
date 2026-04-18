import axios, { AxiosInstance } from 'axios';
import { ImageToVideoRequest, TextImageToVideoRequest, VideoGenerationByTextRequest, VideoGenerationStatusResponse, VideoQueueResponse } from '../interfaces/IRapidApiinterface';
import { Config } from '../config';


export class RapidApiService {
    private readonly axiosInstance: AxiosInstance;
    constructor(){
        this.axiosInstance = axios.create({
            baseURL: 'https://runwayml.p.rapidapi.com',
            headers: {
              'Content-Type': 'application/json',
              "x-rapidapi-host": "runwayml.p.rapidapi.com",
              "x-rapidapi-key": Config.RAPID_API_KEY
            }
          });
    }

    public async generateVideoByText(payload: VideoGenerationByTextRequest): Promise<VideoQueueResponse> {
        const resp = await this.axiosInstance.post("/generate/text", payload);
        console.log(resp.data);
        return resp?.data as unknown as VideoQueueResponse;
    }

    public async generateImageToVideo(payload: ImageToVideoRequest): Promise<VideoQueueResponse> {
        const resp = await this.axiosInstance.post("/generate/image", payload);
        console.log(resp.data);
        return resp?.data as unknown as VideoQueueResponse;
    }

    public async generateImageTextToVideo(payload: TextImageToVideoRequest): Promise<VideoQueueResponse> {
        const resp = await this.axiosInstance.post("/generate/imageDescription", payload);
        console.log(resp.data);
        return resp?.data as unknown as VideoQueueResponse;
    }

    public async getTaskStatusById(uuid: string): Promise<VideoGenerationStatusResponse> {
        const resp = await this.axiosInstance.get(`/status?uuid=${uuid}`);
        console.log(resp.data);
        return resp?.data as unknown as VideoGenerationStatusResponse;
    }
}
