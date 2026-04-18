import { Router } from "express";
import { verifyAdminToken } from "../../middlewares";
import { ReportController } from "../../controllers/admin/report.controller";

export class ReportRoute {
  public router: Router;
  public reportController: ReportController;

  constructor() {
    this.reportController = new ReportController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", verifyAdminToken,this.reportController.index.bind(this.reportController));
  }
}
