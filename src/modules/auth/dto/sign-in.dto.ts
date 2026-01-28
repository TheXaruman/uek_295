// src/modules/auth/dto/sign-in.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsLowercase, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object (DTO) for user sign-in.
 * This class is used to define the structure and validation rules
 * for the data required during the user authentication process.
 */
export class SignInDto {
  @ApiProperty({ type: String, example: 'user1234' })
  @IsNotEmpty()
  @IsLowercase()
  username: string;

  @ApiProperty({ type: String, example: 'user12A$' })
  @IsNotEmpty()
  password: string;
}
