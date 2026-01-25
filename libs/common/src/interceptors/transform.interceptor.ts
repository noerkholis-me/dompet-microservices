import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { SUCCESS_MESSAGE_KEY } from '../decorators/success-message.decorator';
import { ApiResponse } from '@contracts/responses/api-response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    const res = context.switchToHttp().getResponse<ApiResponse<T>>();
    const customMessage = this.reflector.getAllAndOverride<string>(SUCCESS_MESSAGE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return next.handle().pipe(
      map((data: T) => ({
        statusCode: res.statusCode,
        message: customMessage ?? 'Request successful',
        data,
      })),
    );
  }
}
