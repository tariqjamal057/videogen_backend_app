import dotenv from "dotenv";
dotenv.config();

export class Config {
  public static USER_PREFIX: string = "/api/v1/users";
  public static ADMIN_PREFIX: string = "/api/v1/admins";
  public static ENV: string = "dev";
  public static PORT: number = 4000;
  public static MONGO_DB_URI: string = process.env.MONGO_DB_URI || "";
  public static CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || "";
  public static CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || "";
  public static CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || "";
  public static RAPID_API_KEY: string = process.env.RAPID_API_KEY || "";
  public static JWT_SECRET: string = process.env.JWT_SECRET || "";
}
