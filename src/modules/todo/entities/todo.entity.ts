// src/modules/todo/entities/todo.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';

/**
 * Represents a TODO item entity in the database.
 *
 * This entity stores TODO information, including title, description,
 * completion status, and references to the user who created and last
 * updated the item.
 */
@Entity('todo')
export class TodoEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_closed', type: 'boolean', default: false })
  isClosed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by_id', type: 'int' })
  createdById: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity;

  @Column({ name: 'updated_by_id', type: 'int', nullable: true })
  updatedById: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updated_by_id' })
  updatedBy: UserEntity;

  @VersionColumn()
  version: number;
}
