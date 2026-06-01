import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreateCategoryFixture } from '../../src/nest-modules/categories-module/testing/category-fixture';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers';
import { AppModule } from '../../src/app.module';
import { applyGlobalConfig } from '../../src/nest-modules/global-config';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';

describe('CategoriesController (e2e)', () => {
  const appHelper = startApp();
  let categoryRepo: ICategoryRepository;
  beforeEach(async () => {
    categoryRepo = appHelper.app.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });
  describe('/categories (POST)', () => {
    const arrange = CreateCategoryFixture.arrangeForCreate();

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const res = await request(appHelper.app.getHttpServer())
          .post('/categories')
          .send(send_data)
          .expect(201);

        const keysInResponse = CreateCategoryFixture.keysInResponse;
        // body vai receber "data": por causa do interceptor wrapper data
        // strictEqual: toStrictEqual compara profundamente se dois valores (objetos, arrays, etc.) têm a mesma estrutura e valores, sem permitir diferenças como propriedades extras, tipos diferentes ou instâncias diferentes (ex: {} !== new class {}). Ou seja, exige igualdade exata em estrutura e conteúdo.
        expect(Object.keys(res.body)).toStrictEqual(['data']);
        // const presenter = await controller.create(send_data);
        // const entity = await repository.findById(new Uuid(presenter.id));
        // expect(entity.toJSON()).toStrictEqual({
        //   category_id: presenter.id,
        //   created_at: presenter.created_at,
        //   ...expected,
        // });
        // const output = CategoryOutputMapper.toOutput(entity);
        // expect(presenter).toEqual(new CategoryPresenter(output));
      },
    );
  });
  //   let app: INestApplication;

  //   beforeEach(async () => {
  //     const moduleFixture: TestingModule = await Test.createTestingModule({
  //       imports: [AppModule],
  //     }).compile();

  //     app = moduleFixture.createNestApplication();
  //     await app.init();
  //   });

  //   it('/ (GET)', () => {
  //     return request(app.getHttpServer())
  //       .get('/')
  //       .expect(200)
  //       .expect('Hello World!');
  //   });
});