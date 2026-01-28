import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpMetaInterceptor } from './interceptors/http-meta-interceptor.service.interceptor';
import { globalPrefix, swaggerInfo, version } from './informations';
import { writeFileSync } from 'fs';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Debugging JWT_SECRET
  Logger.debug(`Current working directory: ${process.cwd()}`, 'Bootstrap');
  Logger.debug(`JWT_SECRET from ConfigService: ${configService.get<string>('JWT_SECRET')}`, 'Bootstrap');

  const port = configService.get<number>('PORT') || 3000;

  app.useGlobalInterceptors(new HttpMetaInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.setGlobalPrefix(globalPrefix);

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

  const yamlDocument: string = yaml.dump(document);
  writeFileSync('./swagger.yaml', yamlDocument);

  await app.listen(port);

  Logger.log(`NEST application successfully started`, bootstrap.name);
  Logger.debug(
    `Server in version: ${swaggerInfo.docPath} ist jetzt erreichbar unter http://localhost:${port}/${globalPrefix}`,
    bootstrap.name,
  );
  Logger.debug(
    `Swagger ist jetzt erreichbar unter http://localhost:${port}/${swaggerInfo.docPath}`,
    bootstrap.name,
  );
}
bootstrap().catch((err) => console.error(err));
