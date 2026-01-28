// src/modules/auth/services/user.service.ts
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto, ReturnUserDto, UpdateUserAdminDto } from '../dto';
import { PasswordService } from './password.service';
import { SignInDto, TokenInfoDto } from '../dto';

@Injectable()
export class UserService {
  /**
   * A logging instance used to track and record application events, errors, or other messages.
   * This logger is initialized with the name of the `UserService` to associate log messages
   * with the specific service context within the application.
   */
  private readonly logger = new Logger(UserService.name);

  /**
   * Constructor for initializing the service with injected dependencies.
   *
   * @param {Repository<UserEntity>} repo - The repository instance for accessing UserEntity records.
   * @param {PasswordService} passwordService - The service for handling password-related operations.
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
  ) {}

  // region private methods
  /**
   * Finds and retrieves a single entity by the provided username.
   * Logs the operation at various stages and throws a `NotFoundException` if the entity is not found.
   *
   * @param {number} corrId - The correlation ID for logging and tracing the operation.
   * @param {string} username - The username to search for in the repository.
   * @throws {NotFoundException} If the entity with the specified username is not found.
   */
  private async findOneEntityByUsername(corrId: number, username: string) {
    this.logger.verbose(
      `${corrId} ${this.findOneEntityByUsername.name} username: ${username}`,
    );
    const findEntity = await this.repo.findOneBy({ username });
    if (!findEntity) {
      this.logger.debug(
        `${corrId} ${this.findOneEntityByUsername.name} not found`,
      );
      throw new NotFoundException(`User ${username} not found`);
    }
    this.logger.verbose(
      `${corrId} ${this.findOneEntityByUsername.name} found: ${JSON.stringify(findEntity, null, 2)}`,
    );
    return findEntity;
  }

  private entityToDto(corrId: number, entity: UserEntity): ReturnUserDto {
    this.logger.verbose(
      `${corrId} ${this.entityToDto.name} entity: ${JSON.stringify(entity, null, 2)}`,
    );
    // hint: Rückgabe ohne Password oder PasswordHash
    const dto = {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      isAdmin: entity.isAdmin,
    } as ReturnUserDto;
    this.logger.verbose(
      `${corrId} ${this.entityToDto.name} dto: ${JSON.stringify(dto, null, 2)}`,
    );
    return dto;
  }
  // endregion private methods

  // region public methods
  /**
   * Handles user sign-in by validating credentials and generating a token.
   *
   * @param {number} corrId - A unique identifier for correlating logs and tracing the request.
   * @param {SignInDto} signInDto - Data Transfer Object containing the username and password for authentication.
   * @return {Promise<TokenInfoDto>} A promise that resolves to a TokenInfoDto containing authentication token details if successful.
   * @throws {UnauthorizedException} If the provided credentials are invalid.
   */
  async signIn(corrId: number, signInDto: SignInDto): Promise<TokenInfoDto> {
    const user = await this.findOneEntityByUsername(corrId, signInDto.username);
    if (
      !(await this.passwordService.verifyPassword(
        corrId,
        user.passwordHash,
        signInDto.password,
      ))
    ) {
      throw new UnauthorizedException();
    }
    return this.passwordService.sign(corrId, {
      sub: user.id,
      username: user.username,
    });
  }

  /**
   * Creates a new user entity based on the provided data transfer object (DTO) and saves it to the repository.
   * Ensures that the username is unique and generates a hashed password before saving.
   *
   * @param {number} corrId - A unique correlation identifier for tracing logs and operations.
   * @param {number} userId - The ID of the user performing the operation, used for auditing purposes.
   * @param {CreateUserDto} createDto - The data transfer object containing the user's creation details.
   * @throws {ConflictException} Thrown when the username specified in the DTO already exists in the database.
   */
  async create(corrId: number, userId: number, createDto: CreateUserDto) {
    this.logger.debug(
      `${corrId} ${this.create.name} createDto: ${JSON.stringify(createDto, null, 2)}`,
    );
    const createEntity = this.repo.create(createDto);
    // check if the username not already exists
    const existing = await this.repo.findOneBy({
      username: createDto.username,
    });
    if (existing) {
      this.logger.warn(
        `${corrId} ${this.create.name} username already exists: ${createDto.username}`,
      );
      throw new ConflictException(
        `Username ${createDto.username} already exists`,
      );
    }
    // create the password hash
    createEntity.passwordHash = await this.passwordService.hashPassword(
      corrId,
      createDto.password,
    );
    createEntity.createdById = userId;
    createEntity.updatedById = userId;
    const savedEntity = await this.repo.save(createEntity);
    return this.entityToDto(corrId, savedEntity);
  }

  /**
   * Retrieves all entries from the repository and converts them to DTOs.
   *
   * @param {number} corrId - The correlation ID for logging and tracing purposes.
   * @return {Promise<Array>} A promise that resolves to an array of DTOs derived from the repository entries.
   */
  async findAll(corrId: number): Promise<Array<any>> {
    Logger.verbose(`${corrId} ${this.findAll.name}`, UserService.name);
    // find all entries
    const arr = await this.repo.find();
    // convert each entry to a DTO
    return arr.map((e) => this.entityToDto(corrId, e));
  }

  /**
   * Retrieves an entity by its ID and converts it to a data transfer object (DTO).
   * Logs the operation and throws a NotFoundException if the entity does not exist.
   *
   * @param {number} corrId - The correlation ID used for tracing and logging the operation.
   * @param {number} id - The unique identifier of the entity to retrieve.
   * @throws {NotFoundException} If the entity with the specified ID does not exist.
   */
  async findOne(corrId: number, id: number) {
    this.logger.verbose(`${corrId} ${this.findOne.name} id: ${id}`);
    const findEntity = await this.repo.findOneBy({ id });
    if (!findEntity) {
      this.logger.debug(`${corrId} ${this.findOne.name} id: ${id} not found`);
      throw new NotFoundException(`User ${id} not found`);
    }
    return this.entityToDto(corrId, findEntity);
  }

  /**
   * Replaces an existing entity in the repository with updated data, ensuring version consistency.
   *
   * @param {number} corrId - Correlation ID used for tracing and logging purposes.
   * @param {number} userId - ID of the user performing the operation.
   * @param {number} id - ID of the entity to be replaced.
   * @param {ReturnUserDto} returnDto - Data Transfer Object containing the updated entity data.
   * @throws {NotFoundException} If the entity to be replaced does not exist.
   * @throws {ConflictException} If the version of the provided data does not match the version of the existing entity.
   */
  async replace(
    corrId: number,
    userId: number,
    id: number,
    returnDto: ReturnUserDto,
  ): Promise<ReturnUserDto> {
    this.logger.verbose(
      `${corrId} ${this.replace.name} id: ${id} returnDto: ${JSON.stringify(
        returnDto,
        null,
        2,
      )}`,
    );
    const existingEntity = await this.repo.findOneBy({ id });
    if (!existingEntity) {
      this.logger.debug(`${corrId} ${this.replace.name} id: ${id} not found`);
      throw new NotFoundException(`User ${id} not found`);
    }
    // check the version
    if (existingEntity.version !== returnDto.version) {
      this.logger.debug(
        `${corrId} ${this.replace.name} id: ${id} version mismatch. Expected ${existingEntity.version} got ${returnDto.version}`,
      );
      throw new ConflictException(
        `User ${id} version mismatch, expected ${existingEntity.version} got ${returnDto.version}`,
      );
    }
    const replacedEntity = await this.repo.save({
      ...existingEntity,
      ...returnDto,
      updatedById: userId,
      id,
    });
    return this.entityToDto(corrId, replacedEntity);
  }

  /**
   * Updates an existing user entity with the provided data.
   *
   * @param {number} corrId - The correlation ID for logging and tracing purposes.
   * @param {number} userId - The ID of the user performing the update operation.
   * @param {number} id - The ID of the user entity to update.
   * @param {UpdateUserAdminDto} updateUserAdminDto - The data transfer object containing the updated user information.
   * @throws {NotFoundException} If the user entity with the specified ID is not found.
   */
  async update(
    corrId: number,
    userId: number,
    id: number,
    updateUserAdminDto: UpdateUserAdminDto,
  ) {
    this.logger.verbose(
      `${corrId} ${this.update.name} id: ${id} updateUserAdminDto: ${JSON.stringify(
        updateUserAdminDto,
        null,
        2,
      )}`,
    );
    // only administrators can update users
    const existingEntity = await this.repo.findOneBy({ id });
    if (!existingEntity) {
      this.logger.debug(`${corrId} ${this.update.name} id: ${id} not found`);
      throw new NotFoundException(`User ${id} not found`);
    }
    const updatedEntity = await this.repo.save({
      ...existingEntity,
      ...updateUserAdminDto,
      updatedById: userId,
      id,
    });
    return this.entityToDto(corrId, updatedEntity);
  }

  /**
   * Removes an entity identified by its ID from the repository.
   *
   * @param {number} corrId - Correlation identifier for tracing the operation in logs.
   * @param {number} id - The unique identifier of the entity to remove.
   * @throws {NotFoundException} If an entity with the specified ID is not found.
   */
  async remove(corrId: number, id: number) {
    this.logger.verbose(`${corrId} ${this.remove.name} id: ${id}`);
    const existing = await this.repo.findOneBy({ id });
    if (!existing) {
      this.logger.debug(`${corrId} ${this.remove.name} id: ${id} not found`);
      throw new NotFoundException(`User ${id} not found`);
    }
    const deleted = await this.repo.remove(existing);
    this.logger.verbose(
      `${corrId} ${this.remove.name} id: ${id} deleted: ${JSON.stringify(deleted, null, 2)}`,
    );
    return this.entityToDto(corrId, existing);
  }
  // endregion public methods
}
