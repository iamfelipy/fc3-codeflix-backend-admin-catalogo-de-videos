import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundErrorFilter } from './not-found-error.filter';
import request from 'supertest';
import { NotFoundError } from '../../../core/shared/domain/errors/not-found.error';
import { Entity } from '../../../core/shared/domain/entity';

class StubEntity extends Entity {
  entity_id: any;
  toJSON(): Required<any> {
    return {};
  }
}

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new NotFoundError('fake id', StubEntity);
  }
}

describe('NotFoundErrorFilter Unit Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    // “Fixture” em testes refere-se a um objeto/configuração preparatório usado para criar o estado necessário para um teste rodar. 
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new NotFoundErrorFilter());
    await app.init();
  });

  it('should catch a NotFoundError', () => {
    // O método .expect do supertest pode ser chamado múltiplas vezes: a primeira para checar o status HTTP (404) e a segunda para validar o corpo da resposta. Portanto, não há problema em usar .expect duas vezes desse jeito.
    return request(app.getHttpServer()).get('/stub').expect(404).expect({
      statusCode: 404,
      error: 'Not Found',
      message: 'StubEntity Not Found using ID fake id',
    });
  });
});