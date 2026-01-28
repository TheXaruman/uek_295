import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { finalize, Observable } from 'rxjs';
import { randomInt } from 'node:crypto';
import { CorrelationIdRequest } from '../decorators/correlation-id-request';

/**
 * HttpMetaInterceptor is a NestJS interceptor that enhances HTTP metadata for requests and responses.
 * It adds a correlation ID and response time headers to the HTTP response and logs the request details.
 */
@Injectable()
export class HttpMetaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Zugriff auf HTTP Response
    const http = context.switchToHttp();
    const req = http.getRequest<CorrelationIdRequest>();
    const res = http.getResponse<Response>();

    // 1) Correlation ID holen oder generieren
    const headerCorrId = req.header('x-correlation-id');

    // 2) Für @CorrId() verfügbar machen
    const correlationId =
      (headerCorrId ? parseInt(headerCorrId?.trim(), 10) : null) ||
      randomInt(10000, 99999);
    req.correlationId = correlationId;

    Logger.log(
      `${req.correlationId} ${req.method} ${req.url} from ${req.ip}`,
      HttpMetaInterceptor.name,
    );

    // Hochauflösender Start-Zeitpunkt
    const start = process.hrtime.bigint();

    return next.handle().pipe(
      finalize(() => {
        const durationNs = process.hrtime.bigint() - start;
        const durationMs = Number(durationNs) / 1_000_000;

        // Correlation ID im Response Header zurückgeben
        res.setHeader('X-Correlation-Id', correlationId);

        // Header setzen (vor dem Senden der Response)
        res.setHeader('X-Response-Time', `${durationMs.toFixed(2)}ms`);
      }),
    );
  }
}
