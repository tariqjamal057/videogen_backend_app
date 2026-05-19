import App from "./app";
import { Config } from "./config";
import { connectDB } from "./utils/db";
import { IAdmin, IUser } from "./models";
import { IAuthAccessTokenPayload } from "./interfaces/IAuthAccessTokenPayload";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      authUser?: IAuthAccessTokenPayload;
      user?: IUser | null;
      adminUser?: IAdmin | null;
      language?: string | undefined;
    }
  }
}

// connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    const app = new App();
    app.listen(Config.PORT);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
