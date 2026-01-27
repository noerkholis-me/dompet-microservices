import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { AuthenticatedUser } from '@contracts/interfaces';
import { Reflector } from '@nestjs/core';
import { RoleType } from '@contracts/enums';
import { ROLES_KEY } from '@common/decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  private logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      this.logger.debug('No required role');
      return true;
    }

    const user = context.switchToHttp().getRequest<AuthenticatedUser>();
    if (!user || !user.roles) {
      this.logger.debug('User roles not found');
      throw new ForbiddenException('User roles not found');
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      this.logger.debug('User role not match');
      throw new ForbiddenException(`Requires one of these roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
