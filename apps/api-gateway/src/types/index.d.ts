import { JwtPayload } from '@common/types/auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
