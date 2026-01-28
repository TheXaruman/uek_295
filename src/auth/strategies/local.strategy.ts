// src/auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../../user/entities/user.entity';

/**
 * A Passport strategy for authenticating users with a local username and password.
 *
 * This strategy uses the `AuthService` to validate a user's credentials.
 * If the credentials are valid, it returns the user object, which is then
 * attached to the request.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Initializes the local strategy with the authentication service.
   *
   * @param authService The authentication service for validating user credentials.
   */
  constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * Validates a user's credentials.
   *
   * @param username The username to validate.
   * @param password The password to validate.
   * @returns The user object if the credentials are valid.
   * @throws {UnauthorizedException} If the credentials are invalid.
   */
  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
