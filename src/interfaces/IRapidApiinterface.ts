export interface VideoGenerationByTextRequest {
    text_prompt: string;
    model: 'gen3' | string;
    width: number;
    height: number;
    motion: number;
    seed: number;
    callback_url: string;
    time: number;
  }

  export interface ImageToVideoRequest {
    img_prompt: string | string[];
    model: 'gen3' | string;
    image_as_end_frame: boolean;
    flip: boolean;
    motion: number;
    seed: number;
    callback_url: string;
    time: number;
  }

  export interface TextImageToVideoRequest {
    text_prompt: string;
    img_prompt: string | string[];
    model: 'gen3' | string;
    image_as_end_frame: boolean;
    flip: boolean;
    motion: number;
    seed: number;
    callback_url: string;
    time: number;
  }

  export interface VideoGenerationStatusResponse {
    uuid: string;
    status: string;
    progress: number;
    url: string;
    gif_url: string;
  }

  export interface VideoQueueResponse {
    status: string;
    uuid: string;
  }