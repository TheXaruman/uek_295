// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entities/user.entity';
import { Role } from '../enums/role.enum';

/**
 * A Passport strategy for authenticating users with JSON Web Tokens (JWT).
 *
 * This strategy extracts the JWT from the request, verifies it, and then
 * uses the `UserService` to find the user associated with the token.
 * If the user is found, it attaches the user object to the request.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Initializes the JWT strategy with configuration options.
   *
   * @param configService The configuration service for accessing environment variables.
   * @param userService The user service for retrieving user information.
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Validates the JWT payload and retrieves the user.
   *
   * @param payload The decoded JWT payload.
   * @returns The user object associated with the token.
   * @throws {UnauthorizedException} If the user is not found.
   */
  async validate(payload: any): Promise<any> {
    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    const roles = user.isAdmin ? [Role.Admin, Role.User] : [Role.User];
    return { ...user, roles };
  }
}
