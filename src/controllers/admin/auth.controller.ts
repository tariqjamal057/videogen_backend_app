import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import {
    Admin,
    Transaction,
    User,
    Video,
} from '../../models';
import { JWTService } from '../../services/jwt.service';
import { BcryptService } from '../../services/bcrypt.service';

export class AuthController {
    private readonly jwtService: JWTService;
    private readonly bcryptService: BcryptService;
  constructor() {
    this.jwtService = new JWTService();
    this.bcryptService = new BcryptService();
  }
  public async login(req: Request, res: Response): Promise<void> {
    try {
        const admin = await Admin.findOne({ email: req.body.email });
        if(!admin){
            ResponseHandler.error(res, {
                msg: 'Invalid Credentials',
                statusCode: 400,
                error: ['Admin with this email does not exist'],
            });
            return;
        }
        const isValidPassword = await this.bcryptService.comparePassword(req.body.password, admin.password);
        if(!isValidPassword){
            ResponseHandler.error(res, {
                msg: 'Invalid Credentials',
                statusCode: 400,
                error: ['Incorrect password'],
            });
            return;
        }

        const token = await this.jwtService.generateToken({
            id: admin._id.toString(),
            email: admin.email,
        });
      ResponseHandler.success(res, {
        msg: 'Admin logged successfully',
        data: {
            token
        },
      });
    } catch (error) {
      logError(`/api/v1/admins/auth/login`, 'POST', error as Error);
      ResponseHandler.error(res, {
        msg: 'Registration failed',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public getMonthDates() {
    const now = new Date();
  
    // Current Month
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
    // Last Month
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  
    return {
      currentMonthStart,
      currentMonthEnd,
      lastMonthStart,
      lastMonthEnd
    };
  };

  public async dashboard(req: Request, res: Response): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: { totalUsers: number; totalVideos: number; totalRevenue: number; totalValueChangeInRevenue: number; totalValueChangeInUsers: number; totalValueChangeInVideos: number; recentGenerations?: any } = {
        totalUsers: 0,
        totalVideos: 0,
        totalRevenue: 0,
        totalValueChangeInRevenue: 0,
        totalValueChangeInUsers: 0,
        totalValueChangeInVideos: 0,
      }
      data.totalUsers = await User.countDocuments();
      data.totalVideos = await Video.countDocuments();
      const totalRevenue =  await Transaction.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]);
      data.totalRevenue = totalRevenue[0]?.total || 0;
      
       const { currentMonthEnd, currentMonthStart, lastMonthEnd, lastMonthStart } = this.getMonthDates();
        const videosLastMonth = await Video.countDocuments(
        {
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
        });
        const videosCurrentMonth = await Video.countDocuments(
        {
          createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd }
        });

        const usersLastMonth = await User.countDocuments(
          {
            createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
          });
          const usersCurrentMonth = await User.countDocuments(
          {
            createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd }
          });

          const currentMonthRevenue = await Transaction.aggregate([
            {
              $match: {
                createdAt: {
                  $gte: currentMonthStart,
                  $lte: currentMonthEnd
                }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" }
              }
            }
          ]);

          const lastMonthRevenue = await Transaction.aggregate([
            {
              $match: {
                createdAt: {
                  $gte: lastMonthStart,
                  $lte: lastMonthEnd
                }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" }
              }
            }
          ]);

          data.totalValueChangeInRevenue = ((currentMonthRevenue[0]?.total || 0) - (lastMonthRevenue[0]?.total || 0)) / (lastMonthRevenue[0]?.total || 1) * 100;
          data.totalValueChangeInUsers = ((usersCurrentMonth - usersLastMonth) / (usersLastMonth || 1)) * 100;
          data.totalValueChangeInVideos = ((videosCurrentMonth - videosLastMonth) / (videosLastMonth || 1)) * 100;

          data.recentGenerations = await Video.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email image');

      ResponseHandler.success(res, {
        msg: 'Admin logged successfully',
        data: data,
      });
    } catch (error) {
      logError(`/api/v1/admins/auth/dashboard`, 'POST', error as Error);
      ResponseHandler.error(res, {
        msg: 'Registration failed',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async changePassword(req: Request, res: Response): Promise<void> {
    try {
        const admin = await Admin.findOne({ email: req.adminUser?.email });
        console.log('Admin found:', req.adminUser);
        if(!admin){
            ResponseHandler.error(res, {
                msg: 'Invalid Admin',
                statusCode: 400,
                error: ['Admin with this email does not exist'],
            });
            return;
        }
        const isValidPassword = await this.bcryptService.comparePassword(req.body.password, admin.password);
        if(!isValidPassword){
            ResponseHandler.error(res, {
                msg: 'Invalid old password',
                statusCode: 400,
                error: ['Incorrect password'],
            });
            return;
        }

        const hashedPassword = await this.bcryptService.hashPassword(req.body.newPassword);
        admin.password = hashedPassword;
        await admin.save();
      ResponseHandler.success(res, {
        msg: 'Admin password changed successfully',
        data: null,
      });
    } catch (error) {
      logError(`/api/v1/admins/auth/change-password`, 'POST', error as Error);
      ResponseHandler.error(res, {
        msg: 'Registration failed',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }
}
