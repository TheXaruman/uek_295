// src/interceptors/http-meta-interceptor.service.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { Observable, tap } from 'rxjs';

/**
 * An interceptor that logs incoming requests and outgoing responses.
 *
 * This interceptor assigns a unique correlation ID to each request and logs
 * important information such as the request method, URL, execution time,
 * and response status. This helps in tracing and debugging requests
 * throughout the application.
 */
@Injectable()
export class HttpMetaInterceptor implements NestInterceptor {
  /**
   * The logger instance for this interceptor.
   *
   * We use the NestJS `Logger` to ensure that our log messages are
   * formatted and output consistently with the rest of the application.
   */
  private readonly logger = new Logger(HttpMetaInterceptor.name);

  /**
   * Intercepts the request-response cycle to add logging.
   *
   * @param context The execution context of the current request.
   * @param next A handler for the next step in the request pipeline.
   * @returns An observable that resolves to the response.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const id = uuid();
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const { method, url } = req;
    const now = Date.now();

    this.logger.log(`[${id}] ${method} ${url} - Request received`);

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = res;
        const duration = Date.now() - now;
        this.logger.log(
          `[${id}] ${method} ${url} - Response sent with status ${statusCode} in ${duration}ms`,
        );
      }),
    );
  }
}
