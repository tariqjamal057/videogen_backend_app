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
            const payload: any = {
                progress: (response.progress || 0) * 100,
                status: element.status,
            }
            
            if (response.status === 'SUCCEEDED' && response.output && response.output.length > 0) {
                payload.url = response.output[0];
                payload.gifUrl = response.output[0]; // Runway direct output is usually video
                payload.status = 2;
                payload.progress = 100;
            } else if (response.status === 'FAILED') {
                payload.status = 3;
            } else if (response.status === 'RUNNING' || response.status === 'PENDING') {
                payload.status = 1;
            }

            await Video.updateOne({ uuid: element.uuid }, { $set: payload });
        } catch (error) {
            console.error(`Error updating status for video ${element.uuid}:`, error);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }