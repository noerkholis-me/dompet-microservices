import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { ApiErrorResponse } from '@contracts/responses';
import { AxiosError } from 'axios';
import { Response } from 'express';

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AxiosExceptionFilter.name);

  catch(exception: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorData = exception.response?.data as ApiErrorResponse;

    this.logger.error(
      `Upstream Error [${request.method} ${request.url}] -> ${status}`,
      JSON.stringify(errorData || exception.message),
    );

    const errorResponse: ApiErrorResponse = {
      statusCode: status,
      message: errorData?.message || exception.message || 'Service Unavailable',
      error: errorData?.error || 'GatewayError',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
