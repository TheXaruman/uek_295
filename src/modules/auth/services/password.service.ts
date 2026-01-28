// src/modules/auth/services/password.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PayloadDto, TokenInfoDto } from '../dto';

/**
 * Service for handling password-related operations, such as hashing, verifying, and signing tokens.
 */
@Injectable()
export class PasswordService {
  /**
   * The logger instance used for logging messages related to the PasswordService.
   * It is initialized with the name of the PasswordService class as context.
   * This allows for categorized and identifiable log outputs specific to this service.
   */
  private readonly logger = new Logger(PasswordService.name);

  /**
   * Constructs an instance of the class.
   *
   * @param {JwtService} jwtService - An instance of JwtService used for handling JWT-related operations.
   */
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Hashes a given password using the Argon2id algorithm.
   *
   * @param {number} corrId The correlation ID for logging purposes.
   * @param {string} password The plain text password to be hashed.
   * @return {Promise<string>} A promise that resolves to the hashed password as a string.
   */
  async hashPassword(corrId: number, password: string): Promise<string> {
    this.logger.verbose(
      `${corrId} ${this.hashPassword.name} password: ${password}`,
    );
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      // sinnvolle Defaults – kannst du später tunen:
      memoryCost: 19456, // ~19 MB
      timeCost: 2,
      parallelism: 1,
    });
    this.logger.verbose(`${corrId} ${this.hashPassword.name} hash: ${hash}`);
    return hash;
  }

  /**
   * Verifies if the provided password matches the stored hash using the Argon2 algorithm.
   *
   * @param {number} corrId - Correlation ID used for logging to trace the request lifecycle.
   * @param {string} hash - The hashed password to compare against.
   * @param {string} password - The plaintext password to verify.
   * @return {Promise<boolean>} Returns a promise that resolves to `true` if the password is verified successfully, or `false` if it fails.
   */
  async verifyPassword(
    corrId: number,
    hash: string,
    password: string,
  ): Promise<boolean> {
    try {
      const ret = await argon2.verify(hash, password);
      this.logger.verbose(
        `${corrId} ${this.verifyPassword.name} verified: ${ret}`,
      );
      return ret;
    } catch {
      // wenn der Hash kaputt/ungültig ist
      this.logger.warn(`${corrId} ${this.verifyPassword.name} invalid hash`);
      return false;
    }
  }

  /**
   * Asynchronously generates a signed access token based on the provided payload.
   *
   * @param {number} corrId - A unique correlation ID for tracking the request.
   * @param {PayloadDto} payload - The data to be signed and included in the token.
   * @return {Promise<TokenInfoDto>} A promise that resolves to an object containing the access token.
   */
  async sign(corrId: number, payload: PayloadDto): Promise<TokenInfoDto> {
    const access_token = await this.jwtService.signAsync(payload);
    this.logger.verbose(
      `${corrId} ${this.sign.name} access_token: ${access_token}`,
    );
    return { access_token } as TokenInfoDto;
  }
}
