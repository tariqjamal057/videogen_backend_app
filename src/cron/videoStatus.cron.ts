import { Video } from "../models";
import { RunwayService } from "../services/runway.service";
import { StabilityService } from "../services/stability.service";

export async function videoStatusFn() {
  const runwayService = new RunwayService();
  const stabilityService = new StabilityService();
  
  // Find all pending videos
  const videos = await Video.find({ status: 1 });
  
  for (const element of videos) {
    try {
      const response = await runwayService.getTaskStatusById(element.uuid);
      const payload: any = {
        progress: (response.progress || 0) * 100,
        status: element.status,
      };
      
      if (response.status === 'SUCCEEDED' && response.output && response.output.length > 0) {
        const temporaryRunwayUrl = response.output[0];
        
        // Upload to Cloudinary
        const cloudinaryUrl = await stabilityService.uploadToCloudinary(temporaryRunwayUrl);

        // Update database payload referencing your new Cloudinary asset
        payload.url = cloudinaryUrl;
        payload.gifUrl = cloudinaryUrl;
        payload.status = 2;
        payload.progress = 100;
        
      } else if (response.status === 'FAILED') {
        payload.status = 3;
      } else if (response.status === 'RUNNING' || response.status === 'PENDING') {
        payload.status = 1;
      }

      await Video.updateOne({ uuid: element.uuid }, { $set: payload });
    } catch (error) {
      console.error(`Error processing asset for video ${element.uuid}:`, error);
    }
    // Respectful API rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}
