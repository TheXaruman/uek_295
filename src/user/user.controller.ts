// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

/**
 * Controller for handling user-related operations.
 *
 * This controller provides endpoints for creating, retrieving, updating,
 * and deleting users. It is protected by authentication and authorization
 * guards to ensure that only authenticated users with the appropriate roles
 * can access the endpoints.
 *
 * @ApiTags('user') - Groups all endpoints under the 'user' tag in Swagger.
 * @ApiBearerAuth() - Specifies that all endpoints require a bearer token.
 */
@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Endpoint for retrieving the authenticated user's profile.
   *
   * @param req The incoming request object, which includes the authenticated user.
   * @returns The profile of the authenticated user.
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiOperation({ summary: 'Get the profile of the authenticated user' })
  @ApiOkResponse({
    description: 'The profile of the authenticated user.',
    type: User,
  })
  getProfile(@Req() req) {
    return req.user;
  }

  /**
   * Endpoint for creating a new user. (Admin only)
   *
   * @param createUserDto The data for creating the new user.
   * @returns The newly created user.
   */
  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: User,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * Endpoint for retrieving all users. (Admin only)
   *
   * @returns A list of all users.
   */
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiOkResponse({ description: 'A list of all users.', type: [User] })
  findAll() {
    return this.userService.findAll();
  }

  /**
   * Endpoint for retrieving a single user by ID. (Admin only)
   *
   * @param id The ID of the user to retrieve.
   * @returns The user with the specified ID.
   */
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID (Admin only)' })
  @ApiOkResponse({ description: 'The user with the specified ID.', type: User })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  /**
   * Endpoint for updating a user by ID. (Admin only)
   *
   * @param id The ID of the user to update.
   * @param updateUserDto The data for updating the user.
   * @returns The updated user.
   */
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID (Admin only)' })
  @ApiOkResponse({ description: 'The updated user.', type: User })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  /**
   * Endpoint for deleting a user by ID. (Admin only)
   *
   * @param id The ID of the user to delete.
   */
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID (Admin only)' })
  @ApiOkResponse({ description: 'The user has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
