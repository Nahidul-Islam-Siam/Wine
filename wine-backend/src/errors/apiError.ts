export class ApiError extends Error {
  statusCode: number;
  status: boolean;
  details?: any;


  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.status = false;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}
