// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

/**
 * The key used to store roles metadata.
 *
 * This constant is used as the key for setting and retrieving roles
 * metadata on a route handler. It ensures consistency and avoids
 * magic strings when working with roles in the application.
 */
export const ROLES_KEY = 'roles';

/**
 * A decorator for assigning roles to a route handler.
 *
 * This decorator attaches an array of roles to the metadata of a route
 * handler, which can then be used by the `RolesGuard` to perform
 * authorization checks. It allows you to specify which roles are
 * required to access a particular endpoint.
 *
 * @param {...Role[]} roles - An array of roles required to access the endpoint.
 * @returns {any} - The decorator function.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
