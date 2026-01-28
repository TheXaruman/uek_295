// src/modules/auth/dto/token-info.dto.ts
import { ApiProperty } from '@nestjs/swagger';

/**
 * A Data Transfer Object (DTO) for representing token information.
 * This class is primarily used to encapsulate the access token required
 * for authentication purposes in APIs or other systems.
 */
export class TokenInfoDto {
  @ApiProperty({
    description: 'Access token for authentication',
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  access_token: string;
}
