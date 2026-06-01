import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { applyGlobalConfig } from '../../global-config';

export function startApp() {
  let _app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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