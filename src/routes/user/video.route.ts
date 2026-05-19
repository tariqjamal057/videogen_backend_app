import { Router } from "express";
import { verifyToken } from "../../middlewares";
import { VideoController } from "../../controllers/users/video.controller";
import upload from "../../middlewares/multer.middleware";

export class VideoRoute {
  public router: Router;
  public videoController: VideoController;

  constructor() {
    this.videoController = new VideoController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    /**
     * @swagger
     * /api/v1/users/videos/generate:
     *   post:
     *     summary: Generate content using prompt and images
     *     tags: [Video]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             required:
     *               - useOnlyPrompt
     *             properties:
     *               templateId:
     *                 type: string
     *                 example: "template_123"
     *               useOnlyPrompt:
     *                 type: boolean
     *                 example: true
     *               prompt:
     *                 type: string
     *                 example: "Create a video using product description"
     *               files:
     *                 type: array
     *                 items:
     *                   type: string
     *                   format: binary
     *                 description: Upload one or more image files
     *     responses:
     *       200:
     *         description: Successfully generated
     *       400:
     *         description: Invalid input
     */
    this.router.post("/generate", upload.array("files", 2), verifyToken,this.videoController.generate.bind(this.videoController));
    /**
     * @swagger
     * /api/v1/users/videos/status/{uuid}:
     *   get:
     *     summary: Get video generation status by UUID
     *     tags: [Video]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: uuid
     *         required: true
     *         schema:
     *           type: string
     *         description: UUID
     *     responses:
     *       200:
     *         description: Return video generation status by UUID
     */
    this.router.get("/status/:uuid", verifyToken,this.videoController.getVideoStatusById.bind(this.videoController));
    /**
     * @swagger
     * /api/v1/users/videos/gallery:
     *   get:
     *     summary: Get gallery of generated videos
     *     tags: [Video]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Return gallery of generated videos
     */
    this.router.get("/gallery", verifyToken,this.videoController.gallery.bind(this.videoController));
    
    /**
     * @swagger
     * /api/v1/users/videos/{id}:
     *   delete:
     *     summary: Delete a generated video/image by ID
     *     tags: [Video]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Video ID
     *     responses:
     *       200:
     *         description: Video deleted successfully
     */
    this.router.delete("/:id", verifyToken, this.videoController.deleteVideo.bind(this.videoController));

    this.router.post("/rapid-api-webhook",this.videoController.rapidApiWebhook.bind(this.videoController));
  }
}
