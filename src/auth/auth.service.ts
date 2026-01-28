// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';

/**
 * Service responsible for handling authentication.
 *
 * This service provides methods for user authentication, including
 * validating user credentials and generating JSON Web Tokens (JWTs).
 * It uses the `UserService` to retrieve user data and `bcrypt` to
 * compare passwords.
 */
@Injectable()
export class AuthService {
  /**
   * Initializes the authentication service.
   *
   * @param userService The user service for retrieving user data.
   * @param jwtService The JWT service for generating tokens.
   */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates a user's credentials.
   *
   * @param username The username to validate.
   * @param pass The password to validate.
   * @returns The user object if the credentials are valid, otherwise null.
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Logs in a user and returns a JWT.
   *
   * @param user The user object to log in.
   * @returns An object containing the access token.
   */
  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Hashes a password using bcrypt.
   *
   * @param password The password to hash.
   * @returns The hashed password.
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
