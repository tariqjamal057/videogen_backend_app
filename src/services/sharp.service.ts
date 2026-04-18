import sharp from "sharp";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Config } from "../config";

cloudinary.config({
    cloud_name: Config.CLOUDINARY_CLOUD_NAME,
    api_key: Config.CLOUDINARY_API_KEY,
    api_secret: Config.CLOUDINARY_API_SECRET
  });

async function uploadBufferToCloudinary(buffer: Buffer): Promise<UploadApiResponse | undefined> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "combined-images",
          resource_type: "image",
          format: "jpg"
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(buffer);
    });
  }

  async function getImageBuffer(url: string): Promise<Buffer> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch image: ${url}`);
    }
    return Buffer.from(await res.arrayBuffer());
  }
export async function combineLeftRight(images: string[]): Promise<string> {
    sharp.concurrency(1);
    const buffer1 = await getImageBuffer(images[0]);
    const buffer2 = await getImageBuffer(images[1]);
    const leftImg = await sharp(buffer1)
    .resize({ height: 400 })
    .toBuffer();

  const rightImg = await sharp(buffer2)
    .resize({ height: 400 })
    .toBuffer();

  const leftMeta = await sharp(leftImg).metadata();
  const rightMeta = await sharp(rightImg).metadata();

  const finalWidth = leftMeta.width + rightMeta.width;
  const finalHeight = 400;

  const buffer = await sharp({
    create: {
      width: finalWidth,
      height: finalHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([
      { input: leftImg, left: 0, top: 0 },
      { input: rightImg, left: leftMeta.width, top: 0 }
    ])
    .jpeg({ quality: 85 }).toBuffer();
    const uploadResponse = await uploadBufferToCloudinary(buffer);
    console.log(uploadResponse);
    return uploadResponse != undefined ? uploadResponse.secure_url as string : "";
}
