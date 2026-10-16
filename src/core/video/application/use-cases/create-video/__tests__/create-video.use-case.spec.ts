import { CastMemberInMemoryRepository } from '../../../../../cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { CastMembersIdExistsInDatabaseValidator } from '../../../../../cast-member/application/validations/cast-members-ids-exists-in-database.validator';
import { CategoryId } from '../../../../category/domain/category.aggregate';
import { CategoryInMemoryRepository } from '../../../../../category/infra/db/in-memory/category-in-memory.repository';
import { CategoriesIdExistsInDatabaseValidator } from '../../../../../category/application/validations/categories-ids-exists-in-database.validator';
import { GenreId } from '../../../../genre/domain/genre.aggregate';
import { GenreInMemoryRepository } from '../../../../../genre/infra/db/in-memory/genre-in-memory.repository';
import { GenresIdExistsInDatabaseValidator } from '../../../../../genre/application/validations/genres-ids-exists-in-database.validator';
import { UnitOfWorkFakeInMemory } from '../../../../../shared/infra/db/in-memory/fake-unit-of-work-in-memory';
import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error';
import { VideoInMemoryRepository } from '../../../../infra/db/in-memory/video-in-memory.repository';
import { CreateVideoUseCase } from '../create-video.use-case';
import { Rating } from '../../../../domain/rating.vo';
import { Category } from '@core/category/domain/category.aggregate';
import { Genre } from '@core/genre/domain/genre.aggregate';
import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';

describe('CreateVideoUseCase Unit Tests', () => {
  let useCase: CreateVideoUseCase;
  let uow: UnitOfWorkFakeInMemory;
  let videoRepo: VideoInMemoryRepository;
  let categoryRepo: CategoryInMemoryRepository;
  let genreRepo: GenreInMemoryRepository;
  let castMemberRepo: CastMemberInMemoryRepository;
  let categoriesIdValidator: CategoriesIdExistsInDatabaseValidator;
  let genresIdValidator: GenresIdExistsInDatabaseValidator;
  let castMembersIdValidator: CastMembersIdExistsInDatabaseValidator;

  beforeEach(() => {
    uow = new UnitOfWorkFakeInMemory();
    videoRepo = new VideoInMemoryRepository();
    categoryRepo = new CategoryInMemoryRepository();
    genreRepo = new GenreInMemoryRepository();
    castMemberRepo = new CastMemberInMemoryRepository();
    categoriesIdValidator = new CategoriesIdExistsInDatabaseValidator(
      categoryRepo,
    );
    genresIdValidator = new GenresIdExistsInDatabaseValidator(genreRepo);
    castMembersIdValidator = new CastMembersIdExistsInDatabaseValidator(
      castMemberRepo,
    );

    useCase = new CreateVideoUseCase(
      uow,
      videoRepo,
      categoriesIdValidator,
      genresIdValidator,
      castMembersIdValidator,
    );
  });

  it('should create a video without medias', async () => {
    const category = Category.fake().aCategory().build();
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(category.category_id)
      .build();
    const castMember = CastMember.fake().anActor().build();

    await categoryRepo.insert(category);
    await genreRepo.insert(genre);
    await castMemberRepo.insert(castMember);

    const spyUowDo = jest.spyOn(uow, 'do');

    const output = await useCase.execute({
      title: 'test title',
      description: 'test description',
      year_launched: 2023,
      duration: 90,
      rating: Rating.createRL().value,
      is_opened: true,
      categories_id: [category.category_id.id],
      genres_id: [genre.genre_id.id],
      cast_members_id: [castMember.cast_member_id.id],
    });

    expect(spyUowDo).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({ id: expect.any(String) });
    const video = await videoRepo.findById(videoRepo.items[0].video_id);
    expect(video).toBeDefined();
  });

  it('should throw EntityValidationError when input is invalid', async () => {
    await expect(() =>
      useCase.execute({
        title: '',
        description: '',
        year_launched: 0,
        duration: 0,
        rating: 'invalid' as any,
        is_opened: true,
        categories_id: [],
        genres_id: [],
        cast_members_id: [],
      }),
    ).rejects.toThrow(EntityValidationError);
  });
});
