import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          dialect: 'sqlite' as any,
          host: ':memory:',
          logging: false,
          models: [CategoryModel],
        }),
        SequelizeModule.forFeature([CategoryModel]),
      ],
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategorySequelizeRepository,
          useFactory: (categoryModel: typeof CategoryModel) =>
            new CategorySequelizeRepository(categoryModel),
          inject: [getModelToken(CategoryModel)],
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    console.log(controller);
    expect(controller).toBeDefined();
  });
});
