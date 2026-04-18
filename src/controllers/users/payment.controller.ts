import { Request, Response } from 'express';
import { logError, ResponseHandler } from '../../handlers';
import { Plan, Transaction, User } from '../../models';

export class PaymentController {
  public async updateInAppPurchase(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = payload.transaction;
      if(data?.purchaseState != "purchased"){
        ResponseHandler.error(res, {
          statusCode: 400,
          msg: 'Transaction not completed',
        });
        return;
      }
      const transactionData = await Transaction.findOne({
        paymentId: data.transactionId,
      });
      if (transactionData) {
        ResponseHandler.error(res, {
          statusCode: 400,
          msg: 'Invalid transaction',
        });
        return;
      }
      const plan = await Plan.findOne({ playStorePlanId: data.productId });
      if (!plan) {
        ResponseHandler.error(res, {
          statusCode: 404,
          msg: 'Plan not found',
        });
        return;
      }
      const transaction = new Transaction();
      transaction.transactionId =
        Date.now().toString(36) + Math.random().toString(36).substr(2);
      transaction.userId = req.user?._id;
      transaction.planId = plan._id;
      transaction.paymentId = data?.transactionId;
      transaction.status = 2;
      transaction.credits = plan.credits;
      transaction.amount = plan?.amount;
      await transaction.save();
      await User.updateOne(
        { _id: req.user?._id },
        { $inc: { credits: plan.credits } },
      );
      ResponseHandler.success(res, {
        msg: 'Transaction verified successfully',
        data: transaction,
      });
      return;
    } catch (error) {
      console.error(req.body);
      logError(
        `/api/v1/users/payments/verify-in-app-purchase`,
        'POST',
        error as Error,
      );
      ResponseHandler.error(res, {
        statusCode: 500,
        msg: 'Internal Server Error',
        error: [error instanceof Error ? error.message : 'Unknown error'],
      });
      return;
    }
  }

  public async transactions(req: Request, res: Response): Promise<void> {
    try {
      let { page = 1, limit = 10 } = req.query;
      limit = Number(limit);
      page = Number(page);
      const skip = (page - 1) * limit;
      const transactions = await Transaction.find({
        userId: req.user?._id,
      })
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit);
      ResponseHandler.success(res, {
        msg: 'Transaction fetched successfully!!',
        data: transactions,
      });
      return;
    } catch (error) {
      logError(
        `/api/v1/users/payments/verify-in-app-purchase`,
        'POST',
        error as Error,
      );
      ResponseHandler.error(res, {
        statusCode: 500,
        msg: 'Internal Server Error',
        error: [error instanceof Error ? error.message : 'Unknown error'],
      });
      return;
    }
  }
}
