// src/main.ts
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpMetaInterceptor } from './interceptors/http-meta-interceptor.service.interceptor';
import { globalPrefix, swaggerInfo, version } from './informations';

/**
 * Initializes and starts the NestJS application.
 */
async function bootstrap() {
  // Wir erstellen die NestJS-Anwendung basierend auf dem App-Modul.
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Wir lesen den Port aus den Umgebungsvariablen aus, standardmäßig verwenden wir Port 3000.
  const port = configService.get<number>('PORT') || 3000;

  // interceptor statt middleware
  app.useGlobalInterceptors(new HttpMetaInterceptor());

  // globalPipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // globalPrefix
  app.setGlobalPrefix(globalPrefix);

  // openApi setup
  const config = new DocumentBuilder()
    .setTitle(swaggerInfo.title)
    .setDescription(swaggerInfo.description)
    .setContact(
      swaggerInfo.author.name,
      swaggerInfo.author.url,
      swaggerInfo.author.email,
    )
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerInfo.docPath, app, document);

  // Wir lassen die Anwendung auf dem definierten Port lauschen.
  await app.listen(port);

  // Wir verwenden den nestjs Logger, um eine Startmeldung auszugeben.
  Logger.log(`NEST application successfully started`, bootstrap.name);
  Logger.debug(
    `Server in version: ${version} ist jetzt erreichbar unter http://localhost:${port}/${globalPrefix}`,
    bootstrap.name,
  );
  Logger.debug(
    `Swagger ist jetzt erreichbar unter http://localhost:${port}/${swaggerInfo.docPath}`,
    bootstrap.name,
  );
}
bootstrap().catch((err) => console.error(err));
