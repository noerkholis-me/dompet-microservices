import { RoleType } from '../enums/role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: RoleType[];
  iat?: number;
  exp?: number;
}

export type AuthenticatedUser = JwtPayload;
