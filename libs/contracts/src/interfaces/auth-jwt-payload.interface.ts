import { ERoleType } from '@contracts/generated';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: ERoleType[];
  iat?: number;
  exp?: number;
}

export type AuthenticatedUser = JwtPayload;
