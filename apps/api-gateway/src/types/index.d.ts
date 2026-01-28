import { JwtPayload } from '@contracts/interfaces';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
