// src/user/user.service.ts
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Service responsible for user-related operations.
 *
 * This service handles the business logic for creating, retrieving,
 * updating, and deleting users. It interacts with the database through
 * the `UserRepository` and includes error handling for common scenarios
 * such as duplicate usernames or non-existent users.
 */
@Injectable()
export class UserService {
  /**
   * The logger instance for this service.
   *
   * We use the NestJS `Logger` to log important events and errors,
   * helping with debugging and monitoring.
   */
  private readonly logger = new Logger(UserService.name);

  /**
   * Injects the `UserRepository` for database interactions.
   *
   * @param userRepository The repository for the `User` entity.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user in the database.
   *
   * @param createUserDto The data for creating the new user.
   * @returns The newly created user entity.
   * @throws {ConflictException} If a user with the same username already exists.
   * @throws {InternalServerErrorException} If an unexpected error occurs.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(
      `Creating a new user with username: ${createUserDto.username}`,
    );
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      this.logger.warn(
        `Failed to create user. Username '${createUserDto.username}' already exists.`,
      );
      throw new ConflictException(
        `User with username '${createUserDto.username}' already exists`,
      );
    }
    try {
      const user = this.userRepository.create(createUserDto);
      const savedUser = await this.userRepository.save(user);
      this.logger.log(
        `Successfully created user with ID: ${savedUser.id} and username: ${savedUser.username}`,
      );
      return savedUser;
    } catch (error) {
      this.logger.error(
        `Failed to create user with username '${createUserDto.username}'.`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  /**
   * Retrieves all users from the database.
   *
   * @returns A promise that resolves to an array of all users.
   */
  async findAll(): Promise<User[]> {
    this.logger.log('Fetching all users.');
    return this.userRepository.find();
  }

  /**
   * Retrieves a single user by their ID.
   *
   * @param id The ID of the user to retrieve.
   * @returns A promise that resolves to the user entity.
   * @throws {NotFoundException} If no user is found with the given ID.
   */
  async findOne(id: number): Promise<User> {
    this.logger.log(`Fetching user with ID: ${id}`);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`User with ID ${id} not found.`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Retrieves a single user by their username.
   *
   * @param username The username of the user to retrieve.
   * @returns A promise that resolves to the user entity.
   * @throws {NotFoundException} If no user is found with the given username.
   */
  async findOneByUsername(username: string): Promise<User> {
    this.logger.log(`Fetching user with username: ${username}`);
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      this.logger.warn(`User with username '${username}' not found.`);
      throw new NotFoundException(`User with username '${username}' not found`);
    }
    return user;
  }

  /**
   * Updates a user's information.
   *
   * @param id The ID of the user to update.
   * @param updateUserDto The data for updating the user.
   * @returns A promise that resolves to the updated user entity.
   * @throws {NotFoundException} If no user is found with the given ID.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`);
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    this.logger.log(`Successfully updated user with ID: ${id}`);
    return updatedUser;
  }

  /**
   * Deletes a user from the database.
   *
   * @param id The ID of the user to delete.
   * @returns A promise that resolves when the user is deleted.
   * @throws {NotFoundException} If no user is found with the given ID.
   */
  async remove(id: number): Promise<void> {
    this.logger.log(`Attempting to delete user with ID: ${id}`);
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    this.logger.log(`Successfully deleted user with ID: ${id}`);
  }
}
