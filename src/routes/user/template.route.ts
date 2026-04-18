import { Router } from "express";
import { verifyToken } from "../../middlewares";
import { TemplateController } from "../../controllers/users/template.controller";

export class TemplateRoute {
  public router: Router;
  public templateController: TemplateController;

  constructor() {
    this.templateController = new TemplateController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    /**
     * @swagger
     * /api/v1/users/templates:
     *   get:
     *     summary: Get list of templates
     *     tags: [Template]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Return list of templates
     */
    this.router.get("/", verifyToken,this.templateController.getTemplates.bind(this.templateController));
    /**
     * @swagger
     * /api/v1/users/templates/top-templates:
     *   get:
     *     summary: Get list of top templates
     *     tags: [Template]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Return list of top templates
     */
    this.router.get("/top-templates", verifyToken,this.templateController.topTemplates.bind(this.templateController));
  }
}
