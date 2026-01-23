import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Response } from 'express';

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
  catch(exception: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const dataResponse = exception.response?.data as { error?: string };

    const status = exception.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const apiGatewayResponse = {
      statusCode: status,
      message: exception.message || 'Internal Server Error',
      error: dataResponse?.error,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest<Request>().url,
    };

    response.status(status).json(exception.response?.data || apiGatewayResponse);
  }
}
