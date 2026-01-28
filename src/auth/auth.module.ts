// src/auth/auth.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from '../user/user.service';

/**
 * Module for handling authentication.
 *
 * This module provides services for user authentication, including JWT
 * generation and validation. It imports the `UserModule` to access user
 * data and the `JwtModule` to handle JSON Web Tokens.
 *
 * @imports {UserModule} - To access the `UserService`.
 * @imports {PassportModule} - To enable authentication strategies.
 * @imports {JwtModule} - To handle JWT generation and validation.
 * @controllers {AuthController} - The controller for authentication endpoints.
 * @providers {AuthService, JwtStrategy, LocalStrategy} - The services for authentication logic.
 * @exports {AuthService} - To make the `AuthService` available in other modules.
 */
@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    {
      provide: JwtStrategy,
      useFactory: (configService: ConfigService, userService: UserService) => {
        return new JwtStrategy(configService, userService);
      },
      inject: [ConfigService, UserService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
