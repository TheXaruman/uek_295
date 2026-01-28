// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';

/**
 * Controller for handling authentication-related requests.
 *
 * This controller provides endpoints for user registration and login.
 * It uses the `AuthService` to handle the business logic for these
 * operations and is decorated with Swagger documentation to provide
 * clear API information.
 *
 * @ApiTags('auth') - Groups all endpoints under the 'auth' tag in Swagger.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint for user registration.
   *
   * @param createUserDto The data for creating a new user.
   * @returns The newly created user.
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: User,
  })
  async register(@Body() createUserDto: CreateUserDto) {
    const hashedPassword = await this.authService.hashPassword(
      createUserDto.password,
    );
    return this.authService.login(
      await this.authService.validateUser(
        createUserDto.username,
        hashedPassword,
      ),
    );
  }

  /**
   * Endpoint for user login.
   *
   * @param req The incoming request object, which includes the authenticated user.
   * @returns An object containing the access token.
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiOkResponse({
    description: 'The user has been successfully logged in.',
    type: LoginDto,
  })
  async login(@Req() req) {
    return this.authService.login(req.user);
  }
}
