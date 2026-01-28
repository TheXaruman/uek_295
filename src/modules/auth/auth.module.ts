// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UserController } from './controller/user.controller';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PasswordService } from './services/password.service';
import { UserService } from './services/user.service';
import { UserSeedService } from './seed/user-seed.service';
import { UserEntity } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * The `AuthModule` is responsible for handling authentication and user-related functionality
 * within the application. It provides configurations, services, and controllers necessary to
 * facilitate secure authentication and user management.
 *
 * This module integrates with various components and services, utilizing JWT for authentication,
 * password management, and user entity interactions.
 *
 * Module Features:
 * - Registers the `JwtModule` asynchronously with configuration for signing tokens.
 * - Connects to the `UserEntity` from the database using TypeORM.
 * - Provides core authentication guards and services for password and user management.
 * - Includes controllers for handling authentication and user-oriented requests.
 *
 * Components:
 * - Controllers:
 *   - `AuthController`: Handles authentication-related HTTP requests.
 *   - `UserController`: Handles user-related HTTP requests.
 * - Providers:
 *   - `AuthGuard`: Ensures route protection based on authentication status.
 *   - `PasswordService`: Manages user password hashing and validation.
 *   - `UserService`: Handles user-related business logic.
 *   - `UserSeedService`: Populates the database with initial user data.
 *
 * Exports:
 * - `AuthGuard`: Makes the authentication guard available for other modules.
 * - `JwtModule`: Provides access to JWT functionality for external modules.
 * - `PasswordService`: Allows password management in other modules.
 * - `UserService`: Makes user-related services accessible to other modules.
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET environment variable is missing');
        }
        return {
          global: true,
          secret,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [AuthGuard, PasswordService, UserService, UserSeedService],
  controllers: [AuthController, UserController],
  exports: [AuthGuard, JwtModule, PasswordService, UserService],
})
export class AuthModule {}
