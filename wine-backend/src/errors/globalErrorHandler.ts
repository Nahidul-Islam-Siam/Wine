// src/middlewares/globalErrorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ApiError } from "./apiError";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // If error is instance of ApiError (custom)
  if (err instanceof ApiError) {
    console.log(err.statusCode, err.message, err.details);

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      details: err.details || null,
    });
  }

  // Handle unhandled or unknown errors
  console.error("🔥 Unexpected Error:", err);

  return res.status(500).json({
    status: false,
    message: "Internal Server Error",
    errMessage: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

export default globalErrorHandler;
