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
connectDB();

const app = new App();
app.listen(Config.PORT);
