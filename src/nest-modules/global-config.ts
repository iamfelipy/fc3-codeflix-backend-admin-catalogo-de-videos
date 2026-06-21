import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WrapperDataInterceptor } from './shared-module/interceptors/wrapper-data/wrapper-data.interceptor';
import { EntityValidationErrorFilter } from './shared-module/filters/entity-validation-error.filter';
import { NotFoundErrorFilter } from './shared-module/filters/not-found-error.filter';

export function applyGlobalConfig(app: INestApplication) {
  // O oposto de errorHttpStatusCode: 422 (Unprocessable Entity — válido, mas rejeitado por regra de negócio) seria errorHttpStatusCode: 400 (Bad Request — dados inválidos, erro de validação). Use 400 para erros de validação básica.
  app.useGlobalPipes(
    // ativa o class-validator no dto do controller, ativa class-transform, defini o statuscode se der erro de validação
    new ValidationPipe({
      errorHttpStatusCode: 422,
      // foi ativado pq dentro de CastMemberSearchParams o CastmemberType.create precisa receber numero e não string, e o param no search-controler do cast-member vem o type como string
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    // // Se WrapperDataInterceptor recebe um serviço via construtor (injeção de dependência), você deve obtê-lo do container do Nest usando app.get(...) e passar como argumento ao instanciar o interceptor, em vez de usar new WrapperDataInterceptor(), para garantir que as dependências sejam resolvidas corretamente.
    new WrapperDataInterceptor(),
    // O ClassSerializerInterceptor precisa do Reflector para acessar metadados definidos via decorators (como @Exclude, @Expose) nas classes. O Reflector permite que o interceptor saiba quais regras de serialização aplicar em cada rota ou classe, conforme as anotações feitas com decorators do class-transformer.
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalFilters(
    new EntityValidationErrorFilter(),
    new NotFoundErrorFilter(),
  );
}