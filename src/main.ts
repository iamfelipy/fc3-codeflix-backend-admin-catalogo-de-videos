import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );

  // O ClassSerializerInterceptor precisa do Reflector para acessar metadados definidos via decorators (como @Exclude, @Expose) nas classes. O Reflector permite que o interceptor saiba quais regras de serialização aplicar em cada rota ou classe, conforme as anotações feitas com decorators do class-transformer.
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

//Criando a operação de criar categoria