import { Router } from "express";
import { verifyAdminToken } from "../../middlewares";
import { UserController } from "../../controllers/admin/user.controller";

export class UserRoute {
  public router: Router;
  public userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", verifyAdminToken,this.userController.index.bind(this.userController));
    this.router.delete("/:id", verifyAdminToken,this.userController.deleteUser.bind(this.userController));
    this.router.put("/suspend-activate/:id", verifyAdminToken,this.userController.suspendAndActive.bind(this.userController));
    this.router.put("/:id", verifyAdminToken,this.userController.update.bind(this.userController));
    this.router.get("/:id", verifyAdminToken,this.userController.getById.bind(this.userController));
  }
}
