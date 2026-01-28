// src/user/user.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';

/**
 * Module for managing users.
 *
 * This module encapsulates all user-related components, including the
 * `UserService` for business logic, the `UserController` for handling
 * API requests, and the `User` entity for database interactions. It also
 * imports the `AuthModule` to provide authentication and authorization
 * services for protecting user-related endpoints.
 *
 * @imports {TypeOrmModule} - For injecting the `User` repository.
 * @imports {AuthModule} - For providing authentication and authorization.
 * @controllers {UserController} - The controller for user-related endpoints.
 * @providers {UserService} - The service for user-related business logic.
 * @exports {UserService} - To make the `UserService` available in other modules.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
