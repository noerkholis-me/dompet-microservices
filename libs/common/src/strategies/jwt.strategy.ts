import { Injectable, UnauthorizedException, Logger, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser, JwtPayload } from '@contracts/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      Logger.error('JWT_SECRET is not set in environment variables!', { context: JwtStrategy.name });
      throw new ForbiddenException('Service misconfiguration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()]),
      secretOrKey: jwtSecret,
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    if (!payload.sub || !payload.email) {
      this.logger.warn('Invalid JWT payload structure', payload);
      throw new UnauthorizedException('Invalid token payload');
    }

    const user: AuthenticatedUser = {
      sub: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };

    this.logger.debug(`User authenticated: ${user.email} (${user.sub})`);
    return user;
  }
}
