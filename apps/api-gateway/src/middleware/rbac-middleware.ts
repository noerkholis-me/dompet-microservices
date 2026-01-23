import { JwtPayload } from '@common/types/auth.types';
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RbacMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user as JwtPayload;
    if (!user.roles) throw new ForbiddenException('No roles, unauthorized');

    const isAdmin = user.roles.includes('ADMIN');
    // const isPembeli = user.roles.includes('PEMBELI');

    if (req.path.startsWith('/api/users')) {
      if (!isAdmin) throw new ForbiddenException('Admin only');
    }

    if (req.path.startsWith('/api/products')) {
      if (req.method !== 'GET' && !isAdmin) throw new ForbiddenException('Admin only for write');
    }

    if (req.path.includes('/pay')) {
      if (!isAdmin) throw new ForbiddenException('Admin only for payment confirmation');
    }

    next();
  }
}
