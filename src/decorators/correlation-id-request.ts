// src/types/correlation-id-request.ts
import { Request } from 'express';
/**
 * Represents a request object that includes a unique correlation identifier.
 *
 * This type extends the standard `Request` type and adds a `correlationId` property,
 * which is a numerical value used to track and correlate requests for debugging, logging, or
 * tracing purposes.
 *
 * Typically used in distributed systems or APIs to trace the lifecycle of a request
 * across multiple services or components.
 *
 * The `Request` type it extends may include standard properties such as headers, method,
 * URL, and other contextual information about the HTTP request.
 */
export type CorrelationIdRequest = Request & { correlationId: number };
