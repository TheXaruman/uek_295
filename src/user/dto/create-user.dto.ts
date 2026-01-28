// src/user/dto/create-user.dto.ts
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for creating a new user.
 *
 * This DTO defines the validation rules for the data required to create a
 * new user. It includes properties for username, email, password, and an
 * optional administrative flag. Each property is decorated with validation
 * rules and an `ApiProperty` for Swagger documentation.
 */
export class CreateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'The username of the user',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password for the user account',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: false,
    description: 'Flag to indicate if the user is an administrator',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}
