// src/modules/todo/seed/todo-seed.service.ts
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from '../entities/todo.entity';

/**
 * A service responsible for seeding initial TODO data into the database during application bootstrap.
 */
@Injectable()
export class TodoSeedService implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(TodoSeedService.name);

  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepo: Repository<TodoEntity>,
  ) {}

  /**
   * Handles logic that should be executed when the application finishes bootstrapping.
   */
  async onApplicationBootstrap(): Promise<void> {
    await this.seed();
  }

  /**
   * Seeds the database with initial TODO data.
   */
  async seed(): Promise<void> {
    this.logger.debug(`${this.seed.name}: start`);

    const count = await this.todoRepo.count();
    if (count > 0) {
      this.logger.debug(`${this.seed.name}: TODOs already exist, skipping`);
      return;
    }

    const todos = [
      {
        id: 1,
        title: 'OpenAdmin',
        description: 'Example of an open admin todo',
        isClosed: false,
        createdById: 1,
        updatedById: 1,
      },
      {
        id: 2,
        title: 'ClosedAdmin',
        description: 'Example of a closed admin todo',
        isClosed: true,
        createdById: 1,
        updatedById: 1,
      },
      {
        id: 3,
        title: 'OpenUser',
        description: 'Example of an open user todo',
        isClosed: false,
        createdById: 2,
        updatedById: 2,
      },
      {
        id: 4,
        title: 'ClosedUser',
        description: 'Example of a closed user todo',
        isClosed: true,
        createdById: 2,
        updatedById: 2,
      },
    ];

    for (const todoData of todos) {
      this.logger.verbose(`${this.seed.name}: Creating TODO ${todoData.title}`);
      await this.todoRepo.upsert(todoData, ['id']);
    }

    this.logger.debug(`${this.seed.name}: completed`);
  }
}
