// src/modules/auth/seed/user-seed.service.ts
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import * as argon2 from 'argon2';

/**
 * A service responsible for seeding initial user data into the database during application bootstrap.
 * This service ensures the creation of predefined user accounts.
 */
@Injectable()
export class UserSeedService implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(UserSeedService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  /**
   * Handles logic that should be executed when the application finishes bootstrapping.
   */
  async onApplicationBootstrap(): Promise<void> {
    await this.seed();
  }

  /**
   * Seeds the database with initial user data.
   */
  async seed(): Promise<void> {
    this.logger.debug(`${this.seed.name}: start`);

    // admin -> id=1, isAdmin=true, password="admin"
    // user  -> id=2, isAdmin=false, password="user"
    await this.upsertById(1, 'admin', true);
    await this.upsertById(2, 'user', false);
  }

  /**
   * Inserts or updates a user record by its ID.
   */
  private async upsertById(
    id: number,
    username: string,
    isAdmin: boolean,
    password: string = username,
  ): Promise<void> {
    this.logger.verbose(
      `${this.upsertById.name}: id=${id}, username=${username}, isAdmin=${isAdmin}, password=${password}`,
    );
    const existing = await this.userRepo.findOneBy({ id });
    if (existing) return;

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    await this.userRepo.upsert(
      {
        id,
        username: username.toLowerCase(),
        email: `${username}@local.test`.toLowerCase(),
        isAdmin: isAdmin,
        passwordHash,
        createdById: 0,
        updatedById: 0,
      },
      ['id'],
    );
  }
}
