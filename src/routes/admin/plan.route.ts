import { Router } from "express";
import { verifyAdminToken } from "../../middlewares";
import { PlanController } from "../../controllers/admin/plan.controller";

export class PlanRoute {
  public router: Router;
  public planController: PlanController;

  constructor() {
    this.planController = new PlanController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", verifyAdminToken,this.planController.index.bind(this.planController));
    this.router.post("/", verifyAdminToken,this.planController.create.bind(this.planController));
    this.router.delete("/:id", verifyAdminToken,this.planController.deletePlan.bind(this.planController));
    this.router.put("/:id", verifyAdminToken,this.planController.update.bind(this.planController));
    this.router.get("/:id", verifyAdminToken,this.planController.getById.bind(this.planController));
  }
}
