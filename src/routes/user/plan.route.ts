import { Router } from "express";
import { verifyToken } from "../../middlewares";
import { PlanController } from "../../controllers/users/plan.controller";

export class PlanRoute {
  public router: Router;
  public planController: PlanController;

  constructor() {
    this.planController = new PlanController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    /**
     * @swagger
     * /api/v1/users/plans:
     *   get:
     *     summary: Get list of plans
     *     tags: [Plan]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Return list of plans
     */
    this.router.get("/", verifyToken,this.planController.getPlans.bind(this.planController));
  }
}
