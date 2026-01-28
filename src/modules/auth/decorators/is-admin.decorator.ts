// src/modules/auth/decorators/is-admin.decorator.ts
import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { UserRequest } from '../types/user-request';

/**
 * Custom decorator that determines if the currently authenticated user has administrative privileges.
 */
export const IsAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request: UserRequest = ctx.switchToHttp().getRequest();
    Logger.log('', 'IsAdmin.decorator.ts');
    const user = request.user;
    if (!user) {
      Logger.warn('User not found in request', 'isAdmin.decorator.ts');
      return false;
    } else {
      Logger.log(
        `User found: ${user.username} IsAdmin: ${JSON.stringify(user, null, 2)}`,
        'is-admin.decorator.ts',
      );
    }
    return user.isAdmin;
  },
);
