import { Video } from "../models";
import { RapidApiService } from "../services/rapidApi.service";

export async function videoStatusFn() {
    const rapidApiService = new RapidApiService();
    const videos = await Video.find({
      status: 1,
    });
    for (const element of videos) {
        const response = await rapidApiService.getTaskStatusById(element.uuid);
        const payload = {
            progress: response.progress * 100,
            url: "",
            gifUrl: "",
            status: element?.status,
        }
        if(response.url){
            payload.url = response.url;
            payload.gifUrl = response.gif_url;
            payload.status = 2;
        }
        if(response.status === 'failed'){
            payload.status = 3;
        }
        await Video.updateOne({ uuid: response.uuid }, { $set: payload });
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }