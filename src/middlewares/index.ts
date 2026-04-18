import { NextFunction, Request, Response } from "express";
import { logError, ResponseHandler } from "../handlers";
import { firebase } from "../services/firebase.service";
import { IAuthAccessTokenPayload } from "../interfaces/IAuthAccessTokenPayload";
import { Admin, User } from "../models";
import jwt from "jsonwebtoken";
import { Config } from "../config";

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ResponseHandler.error(res, {
        msg: 'Unauthorized: Missing token',
        statusCode: 401,
      });
      return;
    }  
    const idToken = authHeader.split('Bearer ')[1];
  
    try {
      const decodedToken = await firebase.auth().verifyIdToken(idToken);
      req.authUser = decodedToken as IAuthAccessTokenPayload;
      const user = await User.findOne({
        authId: req.authUser.sub,
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      });
      if(user?.isDeleted == true){
        ResponseHandler.error(res, {
          msg: 'Unauthorized: User account deleted. Contact support for more info.',
          statusCode: 401,
        });
        return;
      }
      if(user?.isSuspended == true){
        ResponseHandler.error(res, {
          msg: 'Unauthorized: User account has been suspended. Contact support for more info.',
          statusCode: 401,
        });
        return;
      }
      req.user = user;
      next();
    } catch (error) {
      logError(req.path, req.method, error as Error);
      ResponseHandler.error(res, {
        msg: 'Token expired!!',
        statusCode: 401,
      });
      return;
    }
  };

  export const verifyAdminToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];
      if (!token) {
        ResponseHandler.error(res, {
          msg: 'Unauthorized: Missing token',
          statusCode: 401,
        });
        return;
      }
      const decoded = jwt.verify(token, Config.JWT_SECRET);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const admin = await Admin.findOne({ email: (decoded as any).email });
      if (!admin) {
        ResponseHandler.error(res, {
          msg: 'Unauthorized: Admin not found',
          statusCode: 401,
        });
        return;
      }
      req.adminUser = admin;
      next();
    } catch (error) {
      console.log(error);
      ResponseHandler.error(res, {
        msg: 'Token expired!!',
        statusCode: 401,
      });
      return;
    }
  };