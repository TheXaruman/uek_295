// src/auth/enums/role.enum.ts
/**
 * Enum for defining user roles.
 *
 * This enum is used to define the different roles a user can have within
 * the application. It is used in combination with the `RolesGuard` to
 * protect endpoints and restrict access to authorized users.
 */
export enum Role {
  User = 'user',
  Admin = 'admin',
}
