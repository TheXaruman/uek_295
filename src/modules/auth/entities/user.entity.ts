// src/modules/auth/entities/user.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

/**
 * Represents a user entity in the application.
 * Maps to the 'user' table in the database.
 * This entity stores information about users, including authentication details and metadata.
 *
 * Decorators:
 * - `@Entity('user')`: Specifies the table name this entity is mapped to.
 *
 * Entity Properties:
 * - `id`: Primary key for the user entity. Automatically generated.
 * - `username`: Unique identifier for the user, constrained to a maximum length of 20 characters.
 * - `email`: Email address of the user.
 * - `passwordHash`: Hashed password for user authentication.
 * - `isAdmin`: Flag indicating whether the user has administrative privileges. Defaults to false.
 * - `createdAt`: The date and time when the user record was created. Automatically generated.
 * - `updatedAt`: The date and time when the user record was last updated. Automatically generated.
 * - `version`: Tracks the version of the record for concurrent updates.
 * - `createdById`: Identifies the user who initially created the record.
 * - `updatedById`: Identifies the user who last updated the record.
 */
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  username: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  passwordHash: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @Column({ type: 'int', name: 'created_by_id' })
  createdById: number;

  @Column({ type: 'int', name: 'updated_by_id' })
  updatedById: number;
}
