import { DeleteGenreUseCase } from '../delete-genre.use-case';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { Genre, GenreId } from '../../../../domain/genre.aggregate';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { Category } from '../../../../../category/domain/category.aggregate';
import { GenreSequelizeRepository } from '../../../../infra/db/sequelize/genre-sequelize.repository';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import {
  GenreCategoryModel,
  GenreModel,
} from '../../../../infra/db/sequelize/genre-model';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';

describe('DeleteGenreUseCase Integration Tests', () => {
  let uow: UnitOfWorkSequelize;
  let useCase: DeleteGenreUseCase;
  let genreRepo: GenreSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;

  const sequelizeHelper = setupSequelize({
    models: [GenreModel, GenreCategoryModel, CategoryModel],
  });

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    useCase = new DeleteGenreUseCase(uow, genreRepo);
  });

  it('should throws error when entity not found', async () => {
    const genreId = new GenreId();
    await expect(() => useCase.execute({ id: genreId.id })).rejects.toThrow(
      new NotFoundError(genreId.id, Genre),
    );
  });

  it('should delete a genre', async () => {
    const categories = Category.fake().theCategories(2).build();
    await categoryRepo.bulkInsert(categories);
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(categories[0].category_id)
      .addCategoryId(categories[1].category_id)
      .build();
    await genreRepo.insert(genre);
    await useCase.execute({
      id: genre.genre_id.id,
    });
    await expect(genreRepo.findById(genre.genre_id)).resolves.toBeNull();
  });

  it('rollback transaction', async () => {
    const categories = Category.fake().theCategories(2).build();
    await categoryRepo.bulkInsert(categories);
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(categories[0].category_id)
      .addCategoryId(categories[1].category_id)
      .build();
    await genreRepo.insert(genre);

    // O throw está dentro do hook GenreModel.afterBulkDestroy('hook-test', ...), que retorna Promise.reject(new Error('Generic Error')). Isso faz o Sequelize lançar esse erro durante a exclusão, levando ao teste de rollback.
    // Sim, no Sequelize (e em Promises geralmente), retornar uma Promise.reject dentro de um hook faz com que o erro seja lançado e propagado como uma exceção assíncrona.
    // O hook afterBulkDestroy foi usado no teste para simular uma falha após o método destroy ser chamado no Sequelize, pois o método destroy executado com uma cláusula where (bulk destroy) dispara hooks de bulk (afterBulkDestroy) em vez de hooks individuais. Assim, mesmo usando destroy no repositório, quem escuta falhas transacionais de operações em lote precisa usar afterBulkDestroy.s
    GenreModel.afterBulkDestroy('hook-test', () => {
      return Promise.reject(new Error('Generic Error'));
    });

    await expect(
      useCase.execute({
        id: genre.genre_id.id,
      }),
    ).rejects.toThrow('Generic Error');

    GenreModel.removeHook('afterBulkDestroy', 'hook-test');

    const genres = await genreRepo.findAll();
    expect(genres.length).toEqual(1);
  });
});
