import { RoleType } from '../enums/role.enum';

/**
 * User payload from JWT token
 */
export interface JwtPayload {
  sub: string;
  email: string;
  roles: RoleType[];
  iat?: number;
  exp?: number;
}

/**
 * Authenticated user object attached to request
 */
export interface AuthenticatedUser {
  userId: string;
  email: string;
  roles: RoleType[];
}
