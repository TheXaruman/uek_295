// Importiert Hilfsfunktionen aus NestJS, um eigene Parameter-Dekoratoren zu erstellen
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Eigener Typ für das Request-Objekt,
// der z. B. um `correlationId` erweitert wurde
import { CorrelationIdRequest } from './correlation-id-request';

// Exportiert einen eigenen Parameter-Dekorator namens @CorrId()
/**
 * A custom parameter decorator for retrieving the correlation ID (`correlationId`)
 * from the HTTP request object. The correlation ID is typically set earlier
 * in the request lifecycle, such as in a middleware or an interceptor.
 * It is commonly used for tracking and correlating requests across
 * distributed systems or logs.
 *
 * This decorator works specifically in the HTTP context
 * and extracts the correlation ID from the request object.
 */
export const CorrId = createParamDecorator(
  // _data: optionale Daten, die man dem Decorator übergeben könnte
  // ctx: ExecutionContext enthält Informationen über den aktuellen Request
  (_data: unknown, ctx: ExecutionContext) => {
    // Zugriff auf das HTTP-Request-Objekt
    // switchToHttp() ist nötig, weil NestJS auch andere Kontexte kennt (z. B. GraphQL, RPC)
    const request: CorrelationIdRequest = ctx.switchToHttp().getRequest();

    // Gibt die correlationId zurück,
    // die z. B. vorher in einer Middleware oder einem Interceptor gesetzt wurde
    return request.correlationId;
  },
);
