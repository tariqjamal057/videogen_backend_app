import { Router } from "express";
import { verifyToken } from "../../middlewares";
import { AuthController } from "../../controllers/users/auth.controller";

export class AuthRoute {
  public router: Router;
  public authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.routes();
  }

  private routes() {
        /**
     * @swagger
     * /api/v1/users/auth/register:
     *   post:
     *     summary: Register or update user in database
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *     responses:
     *       200:
     *         description: User created/updated
     */
    this.router.post("/register", verifyToken,this.authController.register.bind(this.authController));
    /**
     * @swagger
     * /api/v1/users/auth/get-user:
     *   get:
     *     summary: Get logged in user's information
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Return logged in user's information
     */
    this.router.get("/get-user", verifyToken,this.authController.getUser.bind(this.authController));
    /**
     * @swagger
     * /api/v1/users/auth/delete-user:
     *   delete:
     *     summary: Delete logged in user's account
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User deleted successfully!!
     */
    this.router.delete("/delete-user", verifyToken,this.authController.deleteUser.bind(this.authController));
  }
}
