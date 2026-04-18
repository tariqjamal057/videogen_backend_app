import { Router } from "express";
import { verifyToken } from "../../middlewares";
import { ReportController } from "../../controllers/users/report.controller";

export class ReportRoute {
  public router: Router;
  public reportController: ReportController;

  constructor() {
    this.reportController = new ReportController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    /**
     * @swagger
     * /api/v1/users/reports:
     *   post:
     *     summary: Report video
     *     tags: [Report]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - videoId
     *             properties:
     *               videoId:
     *                 type: string
     *                 example: "324524436345645"
     *                 required: true
     *               reason:
     *                 type: string
     *     responses:
     *       200:
     *         description: Video reported successfully
     */
    this.router.post("/", verifyToken,this.reportController.reportVideo.bind(this.reportController));
  }
}
