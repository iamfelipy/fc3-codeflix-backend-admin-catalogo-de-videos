import { getModelToken } from '@nestjs/sequelize';
import { CategoryInMemoryRepository } from '../../core/category/infra/db/in-memory/category-in-memory.repository';
import { CreateCategoryUseCase } from '../../core/category/application/use-cases/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '../../core/category/application/use-cases/update-category/update-category.use-case';
import { ListCategoriesUseCase } from '../../core/category/application/use-cases/list-categories/list-categories.use-case';
import { GetCategoryUseCase } from '../../core/category/application/use-cases/get-category/get-category.use-case';
import { DeleteCategoryUseCase } from '../../core/category/application/use-cases/delete-category/delete-category.use-case';
import { CategorySequelizeRepository } from '../../core/category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../core/category/infra/db/sequelize/category.model';
import { ICategoryRepository } from '../../core/category/domain/category.repository';

export const REPOSITORIES = {
  // alias que pode ser usado por outros providers
  CATEGORY_REPOSITORY: {
    provide: 'CategoryRepository',
    // posso trocar por in_memory_repository facilmente
    useExisting: CategorySequelizeRepository,
  },
  CATEGORY_IN_MEMORY_REPOSITORY: {
    provide: CategoryInMemoryRepository,
    useClass: CategoryInMemoryRepository,
  },
  CATEGORY_SEQUELIZE_REPOSITORY: {
    provide: CategorySequelizeRepository,
    useFactory: (categoryModel: typeof CategoryModel) => {
      return new CategorySequelizeRepository(categoryModel);
    },
    // O getModelToken(CategoryModel) retorna o provider padrão registrado para o CategoryModel no contexto do NestJS + Sequelize. Se houver várias conexões Sequelize (databases), ele retorna o model da primeira conexão registrada. Para usar um model de uma conexão específica, você precisa passar o nome da conexão: getModelToken(CategoryModel, 'nomeConexao').
    inject: [getModelToken(CategoryModel)],
  },
};

export const USE_CASES = {
  CREATE_CATEGORY_USE_CASE: {
    provide: CreateCategoryUseCase,
    // a ordem de inject está ligada a ordem da função useFactory
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new CreateCategoryUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  UPDATE_CATEGORY_USE_CASE: {
    provide: UpdateCategoryUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new UpdateCategoryUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  LIST_CATEGORIES_USE_CASE: {
    provide: ListCategoriesUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new ListCategoriesUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  GET_CATEGORY_USE_CASE: {
    provide: GetCategoryUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new GetCategoryUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  DELETE_CATEGORY_USE_CASE: {
    provide: DeleteCategoryUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new DeleteCategoryUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
};

export const CATEGORY_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};