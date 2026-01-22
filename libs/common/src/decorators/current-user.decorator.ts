import { AuthenticatedUser } from '@common/types/auth.types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: keyof AuthenticatedUser, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user: AuthenticatedUser }>();

  return data ? request.user?.[data] : request.user;
});
