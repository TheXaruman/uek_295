// src/modules/auth/controller/auth.controller.ts
import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../decorators';
import { CreateUserDto, ReturnUserDto, SignInDto, TokenInfoDto } from '../dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserService } from '../services/user.service';
import { CorrId } from '../../../decorators/corr-id.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private userService: UserService) {}

  // region sign-in / login
  /**
   * Handles user sign-in by verifying the provided credentials and returning token information if successful.
   *
   * @param {number} corrId - A correlation ID used for logging and tracing the request.
   * @param {SignInDto} signInDto - Data Transfer Object containing the user's sign-in credentials (e.g., username and password).
   * @return {Promise<TokenInfoDto>} The token information generated upon successful authentication.
   */
  @Post('sign-in')
  @ApiOperation({
    summary: `Sign in a user`,
    description: `Sign in a user resource`,
  })
  @ApiCreatedResponse({
    description: `Return the token info`,
    type: TokenInfoDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBody({
    type: SignInDto,
  })
  signIn(
    @CorrId() corrId: number,
    @Body() signInDto: SignInDto,
  ): Promise<TokenInfoDto> {
    this.logger.log(
      `${corrId} ${this.signIn.name} with: ${JSON.stringify(signInDto, null, 2)}`,
    );
    return this.userService.signIn(corrId, signInDto);
  }
  // endregion sign-in / login

  // region register a new user
  /**
   * Handles user registration by creating a new user resource.
   *
   * @param {number} corrId - Correlation ID for tracking the request.
   * @param {CreateUserDto} registerDto - Data transfer object containing the registration details.
   * @return {Promise<ReturnUserDto>} The created user resource.
   */
  @Post('register')
  @ApiOperation({
    summary: `Register a new user`,
    description: `Register a new user resource`,
  })
  @ApiCreatedResponse({
    description: `Return the created user resource`,
    type: ReturnUserDto,
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiConflictResponse({
    description: `The username already exists`,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request, validation failed',
  })
  register(
    @CorrId() corrId: number,
    @Body() registerDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    this.logger.log(
      `${corrId} ${this.register.name} with: ${JSON.stringify(registerDto, null, 2)}`,
    );
    return this.userService.create(corrId, 0, registerDto);
  }
  // endregion register a new user

  // region get user profile
  /**
   * Retrieves the profile of the authenticated user.
   *
   * @param {ReturnUserDto} user - The user object extracted from the authentication context.
   * @return {ReturnUserDto} The profile object of the authenticated user.
   */
  @Get('profile')
  @ApiOperation({
    summary: `Get the user profile`,
    description: `Return the user profile`,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: `Return the user profile`,
    type: ReturnUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  getProfile(@User() user: ReturnUserDto): ReturnUserDto {
    return user;
  }
  // endregion get user profile
}
