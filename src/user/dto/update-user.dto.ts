// src/user/dto/update-user.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * Data transfer object for updating an existing user.
 *
 * This DTO extends the `CreateUserDto` using `PartialType` from
 * `@nestjs/swagger`, making all properties optional. This allows clients
 * to update only the fields they need to change without providing the
 * entire user object.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
