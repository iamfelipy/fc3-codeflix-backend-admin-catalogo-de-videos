import { NestFactory } from '@nestjs/core';
import { MigrationsModule } from './nest-modules/database-module/migrations.module';
import { getConnectionToken } from '@nestjs/sequelize';
import { migrator } from './core/shared/infra/db/sequelize/migrator';

async function bootstrap() {
  //  cria um contexto de aplicação sem servidor HTTP (útil para scripts, workers, etc).
  const app = await NestFactory.createApplicationContext(MigrationsModule, {
    logger: ['error'],
  });

  const sequelize = app.get(getConnectionToken());

  migrator(sequelize).runAsCLI();
}
bootstrap();
