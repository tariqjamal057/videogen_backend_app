import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { Config } from "../config";
import path from "path";

cloudinary.config({
  cloud_name: Config.CLOUDINARY_CLOUD_NAME!,
  api_key: Config.CLOUDINARY_API_KEY!,
  api_secret: Config.CLOUDINARY_API_SECRET!,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const filename = path.parse(file.originalname).name;

    return {
      folder: "uploads",
      resource_type: "auto",
      public_id: `${Date.now()}-${filename}`,
    };
  },
});

const upload = multer({ storage });

export default upload;