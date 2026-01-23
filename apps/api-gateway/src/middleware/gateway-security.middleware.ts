import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GatewaySecurityMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const internalKey = req.headers['x-internal-key'];
    const expectedKey = this.configService.get<string>('INTERNAL_API_KEY');

    if (req.originalUrl.startsWith('/api/')) return next();

    if (!internalKey || internalKey !== expectedKey) {
      throw new ForbiddenException('Invalid internal key');
    }

    next();
  }
}
