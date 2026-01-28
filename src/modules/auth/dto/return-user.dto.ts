// src/modules/auth/dto/return-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * ReturnUserDto serves as a Data Transfer Object for returning user information.
 * It encapsulates essential details about a user, such as identification, credentials, and audit metadata.
 */
export class ReturnUserDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @ApiProperty({ type: String, example: 'user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @IsLowercase()
  username!: string;

  @ApiProperty({ type: String, example: 'user@local.ch' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  @IsNotEmpty()
  isAdmin!: boolean;

  @ApiProperty({ type: Date, example: '2026-01-28T10:00:00.000Z' })
  @IsDate()
  @IsNotEmpty()
  createdAt!: Date;

  @ApiProperty({ type: Date, example: '2026-01-28T10:00:00.000Z' })
  @IsDate()
  @IsNotEmpty()
  updatedAt!: Date;

  @ApiProperty({ type: Number, example: 0 })
  @IsNumber()
  @IsNotEmpty()
  version!: number;

  @ApiProperty({ type: Number, example: 0 })
  @IsNumber()
  @IsNotEmpty()
  createdById!: number;

  @ApiProperty({ type: Number, example: 0 })
  @IsNumber()
  @IsNotEmpty()
  updatedById!: number;
}
