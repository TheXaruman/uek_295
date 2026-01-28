// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { TodoModule } from './modules/todo/todo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

/**
 * AppModule is the root module of the application.
 * It is responsible for importing and configuring other modules.
 */
@Module({
  imports: [
    // wichtig, wenn wir .env verwenden
    ConfigModule.forRoot({
      isGlobal: true, // wichtig, damit überall verfügbar
      envFilePath: join(__dirname, '..', '.env'),
    }),
    // datenbank initialisieren. Wir verwenden sqlite
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoLoadEntities: true,
        synchronize: true, // !! Wichtig: Nur für Entwicklungszwecke aktivieren
        type: 'sqlite',
        database: configService.get<string>('DB_DATABASE', 'data/todo.db'),
      }),
    }),
    AuthModule,
    TodoModule,
  ],
})
export class AppModule {}
