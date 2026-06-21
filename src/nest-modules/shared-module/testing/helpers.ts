import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { applyGlobalConfig } from '../../global-config';
import { Sequelize } from 'sequelize-typescript';
import { getConnectionToken } from '@nestjs/sequelize';

export function startApp() {
  let _app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const sequelize = moduleFixture.get<Sequelize>(getConnectionToken());

    // resolve o problema: Os testes usarem dados ou tabelas antigos, gerando inconsistência.
    // banco fica igual os models
    await sequelize.sync({ force: true });

    _app = moduleFixture.createNestApplication();
    applyGlobalConfig(_app);
    await _app.init();
  });

  afterEach(async () => {
    // o ? é usado pois pode falhar a inicializaçao do _app
    // isso evita eu ver um erro de app close, que pode deixar eu confuso
    await _app?.close();
  });
  
  return {
    get app() {
      return _app;
    },
  };
}