import dotenv from "dotenv";
dotenv.config();

export class Config {
  public static USER_PREFIX: string = "/api/v1/users";
  public static ADMIN_PREFIX: string = "/api/v1/admins";
  public static ENV: string = process.env.NODE_ENV || "dev";
  public static PORT: number = parseInt(process.env.PORT || "4000");
  public static MONGO_DB_URI: string = process.env.MONGO_DB_URI || "";
  public static CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || "";
  public static CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || "";
  public static CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || "";
  public static RAPID_API_KEY: string = process.env.RAPID_API_KEY || "";
  public static JWT_SECRET: string = process.env.JWT_SECRET || "";
  public static RUNWAYML_API_KEY: string = process.env.RUNWAYML_API_KEY || "key_a8602bcb0cb4d424e5fccaf24fd22e068dc232cdde173f44196654c3da842e58104bc99437ac915d9d37eb23da760a0b50b3f156013a0b2da4e3e36ba83347b1";
  public static STABILITY_API_KEY: string = process.env.STABILITY_API_KEY || "";
}
