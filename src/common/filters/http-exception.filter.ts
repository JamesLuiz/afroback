import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const message =
        typeof payload === 'object' &&
        payload !== null &&
        'message' in payload &&
        Array.isArray(payload.message)
          ? payload.message.join(', ')
          : typeof payload === 'object' && payload !== null && 'message' in payload
            ? String(payload.message)
            : exception.message;

      response.status(status).json({
        statusCode: status,
        message,
      });
      return;
    }

    this.logger.error(`Unhandled error on ${request.method} ${request.url}`, exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong. Please try again.',
    });
  }
}
