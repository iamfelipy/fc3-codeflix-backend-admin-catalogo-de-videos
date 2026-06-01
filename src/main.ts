import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyGlobalConfig } from './nest-modules/global-config';

// No contexto de programação, "bootstrap" significa inicializar ou iniciar a aplicação. É uma função que faz a configuração e coloca o servidor para rodar.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyGlobalConfig(app);

  await app.listen(3000);
}
bootstrap();