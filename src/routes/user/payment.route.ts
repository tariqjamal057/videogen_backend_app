import { Router } from "express";
import { verifyToken } from "../../middlewares";
import { PaymentController } from "../../controllers/users/payment.controller";

export class PaymentRoute {
  public router: Router;
  public paymentController: PaymentController;

  constructor() {
    this.paymentController = new PaymentController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    /**
     * @swagger
     * /api/v1/users/payments/verify-in-app-purchase:
     *   post:
     *     summary: Verify in-app purchase and update user credits
     *     tags: [Payment]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - planId
     *             properties:
     *               planId:
     *                 type: string
     *                 example: "324524436345645"
     *                 required: true
     *               transaction:
     *                 type: object
     *                 properties:
     *     responses:
     *       200:
     *         description: Transaction verified successfully
     */
    this.router.post("/verify-in-app-purchase", verifyToken,this.paymentController.updateInAppPurchase.bind(this.paymentController));
    /**
     * @swagger
     * /api/v1/users/payments/transactions:
     *   get:
     *     summary: Fetch user's transaction history
     *     tags: [Payment]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Return user's transaction history
     */
    this.router.get("/transactions", verifyToken,this.paymentController.transactions.bind(this.paymentController));
  }
}
