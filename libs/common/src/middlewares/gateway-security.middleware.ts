import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@Injectable()
export class GatewaySecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(GatewaySecurityMiddleware.name);

  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl === '/' || req.originalUrl === '/health') return next();

    const internalKey = req.headers['x-internal-key'];
    const expectedKey = this.configService.get<string>('INTERNAL_API_KEY');

    if (!expectedKey) {
      this.logger.error('INTERNAL_API_KEY is not set in environment variables!');
      throw new ForbiddenException('Service misconfiguration');
    }

    if (!internalKey || internalKey !== expectedKey) {
      this.logger.warn(`Unauthorized access attempt from IP: ${req.ip}`);
      throw new ForbiddenException('Invalid Internal Key');
    }

    next();
  }
}
