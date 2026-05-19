import express, { Application, Request, Response } from "express";
import { userRoutes, adminRoutes } from "./routes";
import { Config } from "./config";
import cors from "cors";
import { ResponseHandler } from "./handlers";
import path from "path";
import swaggerJsDoc, { SwaggerDefinition } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./docs/swagger.docs";
import cron from "node-cron";
import { videoStatusFn } from "./cron/videoStatus.cron";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwaggerDoc();
    this.initializeCronJobs();
  }

  private initializeSwaggerDoc() {
    const swaggerSpec = swaggerJsDoc(swaggerOptions) as SwaggerDefinition;
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private initializeMiddlewares() {
    this.app.use(
      cors({
        origin: [
          "http://localhost:4200",
          "http://localhost:5173",
          "https://videogen-admin.vercel.app",
          "https://admin.clipzovideoai.com/"
        ],
        credentials: true,
      })
    );
    this.app.set("view engine", "ejs");
    this.app.set("views", path.join(__dirname, "views"));
    
    // 1. Serve from project root /public (where you are copying the images)
    this.app.use(express.static(path.join(process.cwd(), 'public')));
    
    // 2. Serve from src/public (where the original images are)
    this.app.use(express.static(path.join(process.cwd(), 'src', 'public')));
    
    // 3. Fallback for when running from dist folder
    this.app.use(express.static(path.join(__dirname, 'public')));

    this.app.use(express.json({ limit: "100mb" })); // Parse incoming JSON requests
    this.app.use(express.urlencoded({ limit: "100mb", extended: true })); // Parse URL-encoded payloads
  }

  private initializeCronJobs(){
    console.log("Initializing cron jobs");
    cron.schedule("*/5 * * * * *", async () => {
      try {
        videoStatusFn();
        console.log("Every 5 second job started for video status");
      } catch (error) {
        console.error("Cron failed:", error);
      }
    });
  }

  private initializeRoutes() {
    // server running status check
    this.app.get(`/`, (req: Request, res: Response) => {
      ResponseHandler.success<null>(res, {
        msg: `✅ ${Config.ENV} server is running!!`,
        data: null,
      });
    });

    this.app.use(
      `${Config.USER_PREFIX}/auth`,
      new userRoutes.AuthRoute().router
    );
    this.app.use(
      `${Config.USER_PREFIX}/templates`,
      new userRoutes.TemplateRoute().router
    );
    this.app.use(
      `${Config.USER_PREFIX}/videos`,
      new userRoutes.VideoRoute().router
    );
    this.app.use(
      `${Config.USER_PREFIX}/plans`,
      new userRoutes.PlanRoute().router
    );
    this.app.use(
      `${Config.USER_PREFIX}/payments`,
      new userRoutes.PaymentRoute().router
    );
    this.app.use(
      `${Config.USER_PREFIX}/reports`,
      new userRoutes.ReportRoute().router
    );


    // admin routes
    this.app.use(
      `${Config.ADMIN_PREFIX}/auth`,
      new adminRoutes.AuthRoute().router
    );
    this.app.use(
      `${Config.ADMIN_PREFIX}/categories`,
      new adminRoutes.CategoryRoute().router
    );
    this.app.use(
      `${Config.ADMIN_PREFIX}/plans`,
      new adminRoutes.PlanRoute().router
    );
    this.app.use(
      `${Config.ADMIN_PREFIX}/templates`,
      new adminRoutes.TemplateRoute().router
    );
    this.app.use(
      `${Config.ADMIN_PREFIX}/users`,
      new adminRoutes.UserRoute().router
    );
    this.app.use(
      `${Config.ADMIN_PREFIX}/videos`,
      new adminRoutes.VideoRoute().router
    );
    this.app.use(
      `${Config.ADMIN_PREFIX}/transactions`,
      new adminRoutes.TransactionRoute().router
    );
    this.app.use(
      `${Config.ADMIN_PREFIX}/reports`,
      new adminRoutes.ReportRoute().router
    );
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  }
}

export default App;
