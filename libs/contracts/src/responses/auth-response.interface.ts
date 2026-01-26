import { ERoleType, User } from '@contracts/generated';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export type UserOmitPassword = Omit<User, 'password' | 'roles'> & {
  roles: ERoleType[];
};

export interface AuthResponse {
  user: UserOmitPassword;
  token: TokenResponse;
}
