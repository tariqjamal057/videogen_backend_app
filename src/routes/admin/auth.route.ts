import { Router } from "express";
import { AuthController } from "../../controllers/admin/auth.controller";
import { verifyAdminToken } from "../../middlewares";

export class AuthRoute {
  public router: Router;
  public authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.post("/login",this.authController.login.bind(this.authController));
    this.router.get("/dashboard", verifyAdminToken,this.authController.dashboard.bind(this.authController));
    this.router.post("/change-password", verifyAdminToken,this.authController.changePassword.bind(this.authController));
  }
}
