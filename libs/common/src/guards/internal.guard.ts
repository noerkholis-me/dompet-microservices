import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedUser } from '@contracts/interfaces';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class InternalGuard implements CanActivate {
  private readonly logger = new Logger(InternalGuard.name);

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const internalKey = this.configService.getOrThrow<string>('INTERNAL_API_KEY');
    const headerKey = request.headers['x-internal-key'];

    if (!headerKey || internalKey !== headerKey) {
      throw new UnauthorizedException('Invalid internal key');
    }

    const userHeader = request.headers['user'];
    if (userHeader && typeof userHeader === 'string') {
      try {
        request.user = JSON.parse(userHeader) as AuthenticatedUser;
      } catch (e) {
        this.logger.error('Failed to parse user header propagation', e);
        throw new UnauthorizedException('Invalid User Context Propagation');
      }
    }

    return true;
  }
}
