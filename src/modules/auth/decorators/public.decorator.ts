// src/modules/auth/decorators/public.decorator.ts
import { CustomDecorator, SetMetadata } from '@nestjs/common';

/**
 * A utility function that applies metadata to indicate that a certain resource
 * or functionality is publicly accessible.
 */
export const Public = (...args: string[]): CustomDecorator =>
  SetMetadata('isPublic', true);
