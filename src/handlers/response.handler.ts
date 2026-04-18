import { Response } from "express";

export interface SuccessResponse<T> {
  success?: boolean;
  msg?: string;
  data?: T | null;
}

export interface ErrorResponse {
  status?: boolean;
  msg?: string;
  error?: Array<string>;
  statusCode?: number;
}

export class ResponseHandler {
  static success<T>(res: Response, data: SuccessResponse<T>): Response {
    return res.status(200).json({
      success: true,
      msg: data.msg || "Request was successful",
      data: data.data || null,
    });
  }

  static error(res: Response, error: ErrorResponse): Response {
    return res.status(error.statusCode || 500).json({
      status: false,
      msg: error.msg || "An error occurred",
      error: error.error || null,
    });
  }
}
