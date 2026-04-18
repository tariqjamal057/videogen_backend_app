import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import {
    Transaction,
} from '../../models';

export class TransactionController {
  public async index(req: Request, res: Response): Promise<void> {
    try {
        const transactions = await Transaction.find().populate('userId', 'name email image').populate('planId', 'name price duration');
      ResponseHandler.success(res, {
        msg: 'Transactions listed successfully',
        data: transactions,
      });
    } catch (error) {
      logError(`/api/v1/admins/transactions`, 'GET', error as Error);
      ResponseHandler.error(res, {
        msg: 'Internal server error',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }
}
