// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for the response of a successful login.
 *
 * This DTO defines the shape of the response when a user successfully
 * logs in. It includes the `access_token`, which is a JSON Web Token
 * that can be used to authenticate subsequent requests.
 */
export class LoginDto {
  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'The access token for the authenticated user.',
  })
  access_token: string;
}
