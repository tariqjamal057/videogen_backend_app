import { Router } from "express";
import { verifyAdminToken } from "../../middlewares";
import { TransactionController } from "../../controllers/admin/transaction.controller";

export class TransactionRoute {
  public router: Router;
  public transactionController: TransactionController;

  constructor() {
    this.transactionController = new TransactionController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", verifyAdminToken,this.transactionController.index.bind(this.transactionController));
  }
}
