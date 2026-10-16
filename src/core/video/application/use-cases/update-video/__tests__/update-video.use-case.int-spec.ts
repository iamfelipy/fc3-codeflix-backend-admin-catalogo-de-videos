import { CastMember } from '../../../../../cast-member/domain/cast-member.aggregate';
import {
  CastMemberModel,
  CastMemberSequelizeRepository,
} from '../../../../../cast-member/infra/db/sequelize/cast-member-sequelize';
import { CastMembersIdExistsInDatabaseValidator } from '../../../../../cast-member/application/validations/cast-members-ids-exists-in-database.validator';
import { Category } from '../../../../../category/domain/category.aggregate';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { CategoriesIdExistsInDatabaseValidator } from '../../../../../category/application/validations/categories-ids-exists-in-database.validator';
import { Genre } from '../../../../../genre/domain/genre.aggregate';
import { GenreModel } from '../../../../../genre/infra/db/sequelize/genre-model';
import { GenreSequelizeRepository } from '../../../../../genre/infra/db/sequelize/genre-sequelize.repository';
import { GenresIdExistsInDatabaseValidator } from '../../../../../genre/application/validations/genres-ids-exists-in-database.validator';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { Video, VideoId } from '../../../../domain/video.aggregate';
import { VideoSequelizeRepository } from '../../../../infra/db/sequelize/video-sequelize.repository';
import { setupSequelizeForVideo } from '../../../../infra/db/sequelize/testing/helpers';
import { VideoModel } from '../../../../infra/db/sequelize/video.model';
import { UpdateVideoUseCase } from '../update-video.use-case';

describe('UpdateVideoUseCase Integration Tests', () => {
  const sequelizeHelper = setupSequelizeForVideo();
  let useCase: UpdateVideoUseCase;
  let videoRepo: VideoSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;
  let genreRepo: GenreSequelizeRepository;
  let castMemberRepo: CastMemberSequelizeRepository;
  let uow: UnitOfWorkSequelize;
  let categoriesIdValidator: CategoriesIdExistsInDatabaseValidator;
  let genresIdValidator: GenresIdExistsInDatabaseValidator;
  let castMembersIdValidator: CastMembersIdExistsInDatabaseValidator;

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    videoRepo = new VideoSequelizeRepository(VideoModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    castMemberRepo = new CastMemberSequelizeRepository(CastMemberModel);
    categoriesIdValidator = new CategoriesIdExistsInDatabaseValidator(
      categoryRepo,
    );
    genresIdValidator = new GenresIdExistsInDatabaseValidator(genreRepo);
    castMembersIdValidator = new CastMembersIdExistsInDatabaseValidator(
      castMemberRepo,
    );

    useCase = new UpdateVideoUseCase(
      uow,
      videoRepo,
      categoriesIdValidator,
      genresIdValidator,
      castMembersIdValidator,
    );
  });

  it('should update a video', async () => {
    const category = Category.fake().aCategory().build();
    await categoryRepo.insert(category);
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.insert(genre);
    const castMember = CastMember.fake().anActor().build();
    await castMemberRepo.insert(castMember);

    const video = Video.fake()
      .aVideoWithoutMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .addCastMemberId(castMember.cast_member_id)
      .build();
    await videoRepo.insert(video);

    const output = await useCase.execute({
      id: video.video_id.id,
      title: 'updated title',
    });

    expect(output).toStrictEqual({ id: video.video_id.id });
    const updated = await videoRepo.findById(video.video_id);
    expect(updated!.title).toBe('updated title');
  });
});
