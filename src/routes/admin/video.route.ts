import { Router } from "express";
import { verifyAdminToken } from "../../middlewares";
import { VideoController } from "../../controllers/admin/video.controller";

export class VideoRoute {
  public router: Router;
  public videoController: VideoController;

  constructor() {
    this.videoController = new VideoController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", verifyAdminToken,this.videoController.index.bind(this.videoController));
    this.router.delete("/:id", verifyAdminToken,this.videoController.deleteVideo.bind(this.videoController));
  }
}
