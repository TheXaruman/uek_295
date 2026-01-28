// src/modules/auth/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * CreateUserDto is a Data Transfer Object used to encapsulate and validate
 * the user data required for creating a new user in the application.
 * It ensures all necessary properties adhere to specific validation rules.
 *
 * Properties:
 * - username: Represents the username of the user. The value must be a non-empty,
 *   lowercase string between 8 and 20 characters in length.
 * - email: Represents the email address of the user. The value must be a valid
 *   email string and cannot be empty.
 * - password: Represents the password of the user. The value must be a non-empty
 *   string with a minimum length of 8 characters, including at least one lowercase
 *   letter, one uppercase letter, one digit, and one special character from
 *   the set [@$!%*?&].
 */
export class CreateUserDto {
  @ApiProperty({ type: String, example: 'user1234' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsLowercase()
  username!: string;

  @ApiProperty({ type: String, example: 'user@local.ch' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ type: String, example: 'user12A$' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain a lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain an uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain a number',
  })
  @Matches(/(?=.*[@$!%*?&])/, {
    message: 'Password must contain a special character [@$!%*?&]',
  })
  password!: string;
}
