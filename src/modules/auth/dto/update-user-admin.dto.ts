// src/modules/auth/dto/update-user-admin.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object (DTO) for updating a user's admin status.
 */
export class UpdateUserAdminDto {
  @ApiProperty({ type: Boolean, example: true })
  @IsBoolean()
  @IsNotEmpty()
  isAdmin!: boolean;
}
