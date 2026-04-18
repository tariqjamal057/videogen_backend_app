import { Router } from "express";
import { CategoryController } from "../../controllers/admin/category.controller";
import { verifyAdminToken } from "../../middlewares";

export class CategoryRoute {
  public router: Router;
  public categoryController: CategoryController;

  constructor() {
    this.categoryController = new CategoryController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", verifyAdminToken,this.categoryController.index.bind(this.categoryController));
    this.router.post("/", verifyAdminToken,this.categoryController.create.bind(this.categoryController));
    this.router.delete("/:id", verifyAdminToken,this.categoryController.deleteCategory.bind(this.categoryController));
    this.router.get("/:id", verifyAdminToken,this.categoryController.getById.bind(this.categoryController));
  }
}
