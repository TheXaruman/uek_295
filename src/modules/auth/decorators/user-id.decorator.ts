// src/modules/auth/decorators/user-id.decorator.ts
import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { UserRequest } from '../types/user-request';

/**
 * A custom parameter decorator for extracting the User ID from the current HTTP request.
 */
export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request: UserRequest = ctx.switchToHttp().getRequest();
    Logger.log('', 'UserId.decorator.ts');
    const user = request.user;
    if (!user) {
      Logger.warn('User not found in request', 'UserId.decorator.ts');
    } else {
      Logger.log(
        `User found: ${user.username} UserId: ${JSON.stringify(user, null, 2)}`,
        'is-UserId.decorator.ts',
      );
    }
    return user.id;
  },
);
