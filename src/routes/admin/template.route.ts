import { Router } from "express";
import { verifyAdminToken } from "../../middlewares";
import { TemplateController } from "../../controllers/admin/template.controller";
import upload from "../../middlewares/multer.middleware";

export class TemplateRoute {
  public router: Router;
  public templateController: TemplateController;

  constructor() {
    this.templateController = new TemplateController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", verifyAdminToken,this.templateController.index.bind(this.templateController));
    this.router.post("/", upload.single("image"), verifyAdminToken,this.templateController.create.bind(this.templateController));
    this.router.delete("/:id", verifyAdminToken,this.templateController.deleteTemplate.bind(this.templateController));
    this.router.put("/:id", upload.single("image"), verifyAdminToken,this.templateController.update.bind(this.templateController));
    this.router.get("/:id", verifyAdminToken,this.templateController.getById.bind(this.templateController));
  }
}
