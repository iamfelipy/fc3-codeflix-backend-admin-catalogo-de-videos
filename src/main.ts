import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { WrapperDataInterceptor } from './nest-modules/shared-module/interceptors/wrapper-data/wrapper-data.interceptor';
import { NotFoundErrorFilter } from './nest-modules/shared-module/filters/not-found-error.filter';
import { EntityValidationErrorFilter } from './nest-modules/shared-module/filters/entity-validation-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // O oposto de errorHttpStatusCode: 422 (Unprocessable Entity — válido, mas rejeitado por regra de negócio) seria errorHttpStatusCode: 400 (Bad Request — dados inválidos, erro de validação). Use 400 para erros de validação básica.
      errorHttpStatusCode: 422,
    }),
  );

  // O ClassSerializerInterceptor precisa do Reflector para acessar metadados definidos via decorators (como @Exclude, @Expose) nas classes. O Reflector permite que o interceptor saiba quais regras de serialização aplicar em cada rota ou classe, conforme as anotações feitas com decorators do class-transformer.
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Se WrapperDataInterceptor recebe um serviço via construtor (injeção de dependência), você deve obtê-lo do container do Nest usando app.get(...) e passar como argumento ao instanciar o interceptor, em vez de usar new WrapperDataInterceptor(), para garantir que as dependências sejam resolvidas corretamente.
  app.useGlobalInterceptors(new WrapperDataInterceptor());

  app.useGlobalFilters(
    new NotFoundErrorFilter(),
    new EntityValidationErrorFilter(),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

//Criando a operação de criar categoria