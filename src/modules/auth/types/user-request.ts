// src/modules/auth/types/user-request.ts
import { CorrelationIdRequest } from '../../../decorators/correlation-id-request';
import { ReturnUserDto } from '../dto';

/**
 * Represents a user-related request that extends the CorrelationIdRequest.
 */
export type UserRequest = CorrelationIdRequest & { user: ReturnUserDto };
