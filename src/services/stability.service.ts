import axios from 'axios';
import { Config } from '../config';
import { v2 as cloudinary } from 'cloudinary';
import FormData from 'form-data';
import fs from 'fs';

cloudinary.config({
  cloud_name: Config.CLOUDINARY_CLOUD_NAME,
  api_key: Config.CLOUDINARY_API_KEY,
  api_secret: Config.CLOUDINARY_API_SECRET,
});

export class StabilityService {
  public async generateImage(prompt: string, imagePath?: string | null): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('output_format', 'webp');
    
    // Using 'ultra' for best quality and better prompt adherence when combining with an image
    let url = 'https://api.stability.ai/v2beta/stable-image/generate/ultra';
    
    if (imagePath && fs.existsSync(imagePath)) {
      formData.append('image', fs.createReadStream(imagePath));
      // For ultra img2img, strength (0.0 to 1.0) controls how much it changes.
      // Higher means more like the prompt, lower means more like original image.
      // 0.8 is a strong value to allow background changes and pose adjustments.
      formData.append('strength', 0.8); 
    }

    const response = await axios.post(
      url,
      formData,
      {
        validateStatus: (status) => status < 500,
        headers: {
          Authorization: `Bearer ${Config.STABILITY_API_KEY}`,
          Accept: 'image/*',
          ...formData.getHeaders(),
        },
        responseType: 'arraybuffer',
      }
    );

    if (response.status !== 200) {
      throw new Error(`Stability API error: ${response.status} ${response.data.toString()}`);
    }

    // Upload result to Cloudinary
    const resultUrl: string = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'generated_images' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || '');
        }
      ).end(response.data);
    });

    // Cleanup input image if exists
    if (imagePath && fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (e) {
        console.error("Failed to delete temp file:", e);
      }
    }

    return { url: resultUrl };
  }

  /**
   * Helper to upload local file to cloudinary (useful for video input images)
   */
  public async uploadToCloudinary(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) return "";
    const result = await cloudinary.uploader.upload(filePath, { folder: "uploads" });
    // Keep file if needed by other services, or delete here if sure
    return result.secure_url;
  }
}