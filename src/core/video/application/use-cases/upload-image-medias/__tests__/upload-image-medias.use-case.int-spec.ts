import { CastMember } from '../../../../../cast-member/domain/cast-member.aggregate';
import {
  CastMemberModel,
  CastMemberSequelizeRepository,
} from '../../../../../cast-member/infra/db/sequelize/cast-member-sequelize';
import { Category } from '../../../../../category/domain/category.aggregate';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { Genre } from '../../../../../genre/domain/genre.aggregate';
import { GenreModel } from '../../../../../genre/infra/db/sequelize/genre-model';
import { GenreSequelizeRepository } from '../../../../../genre/infra/db/sequelize/genre-sequelize.repository';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { InMemoryStorage } from '../../../../../shared/infra/storage/in-memory.storage';
import { Video } from '../../../../domain/video.aggregate';
import { VideoSequelizeRepository } from '../../../../infra/db/sequelize/video-sequelize.repository';
import { setupSequelizeForVideo } from '../../../../infra/db/sequelize/testing/helpers';
import { VideoModel } from '../../../../infra/db/sequelize/video.model';
import { UploadImageMediasUseCase } from '../upload-image-medias.use-case';

describe('UploadImageMediasUseCase Integration Tests', () => {
  const sequelizeHelper = setupSequelizeForVideo();
  let useCase: UploadImageMediasUseCase;
  let videoRepo: VideoSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;
  let genreRepo: GenreSequelizeRepository;
  let castMemberRepo: CastMemberSequelizeRepository;
  let uow: UnitOfWorkSequelize;
  let storage: InMemoryStorage;

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    videoRepo = new VideoSequelizeRepository(VideoModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    castMemberRepo = new CastMemberSequelizeRepository(CastMemberModel);
    storage = new InMemoryStorage();
    useCase = new UploadImageMediasUseCase(uow, videoRepo, storage);
  });

  it('should upload banner image', async () => {
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

    await useCase.execute({
      video_id: video.video_id.id,
      field: 'banner',
      file: {
        raw_name: 'banner.jpg',
        data: Buffer.from('test'),
        mime_type: 'image/jpeg',
        size: 100,
      },
    });

    const updated = await videoRepo.findById(video.video_id);
    expect(updated!.banner).toBeDefined();
  });
});
