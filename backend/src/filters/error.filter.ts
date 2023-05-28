import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiError } from '../exceptions/api-error';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Непредвиденная ошибка';
    let errors: string[] = [];
    let errorStack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof ApiError) {
      status = exception.status;
      message = exception.message;
      errors = exception.errors || [];
    }

   
    if (exception instanceof Error && !(exception instanceof ApiError)) {
      errorStack = exception.stack;
    }

    response.status(status).json({ status, message, errors, errorStack });
  }
}
