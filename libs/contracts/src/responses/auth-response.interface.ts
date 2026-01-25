import { ERoleType, User } from '@contracts/generated';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export type UserResponse = Omit<User, 'password'> & {
  roles: ERoleType[];
};

export interface AuthResponse {
  user: UserResponse;
  token: TokenResponse;
}
