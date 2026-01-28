// src/modules/todo/todo.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';
import { TodoSeedService } from './seed/todo-seed.service';

/**
 * TodoModule handles TODO-related functionality.
 * Currently only includes the entity and seed service.
 * Controller and Service will be added in Step 3.
 */
@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  providers: [TodoSeedService],
  exports: [],
})
export class TodoModule {}
