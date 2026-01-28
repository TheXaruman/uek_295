// src/user/entities/user.entity.ts
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

/**
 * Represents a user entity in the database.
 *
 * This entity stores user information, including their username, email,
 * password, and administrative status. It also includes timestamps for
 * creation, updates, and deletion, as well as a version number for
 * optimistic concurrency control.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: false })
  password?: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Exclude()
  @VersionColumn()
  version: number;
}
