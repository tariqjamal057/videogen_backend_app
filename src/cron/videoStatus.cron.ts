import { Video } from "../models";
import { RunwayService } from "../services/runway.service";

export async function videoStatusFn() {
    const runwayService = new RunwayService();
    const videos = await Video.find({
      status: 1,
    });
    for (const element of videos) {
        try {
            const response = await runwayService.getTaskStatusById(element.uuid);
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
        } catch (error) {
            console.error(`Error updating status for video ${element.uuid}:`, error);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }