import { CastMemberInMemoryRepository } from '../../../../../cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { CastMembersIdExistsInDatabaseValidator } from '../../../../../cast-member/application/validations/cast-members-ids-exists-in-database.validator';
import { CategoryInMemoryRepository } from '../../../../../category/infra/db/in-memory/category-in-memory.repository';
import { CategoriesIdExistsInDatabaseValidator } from '../../../../../category/application/validations/categories-ids-exists-in-database.validator';
import { GenreInMemoryRepository } from '../../../../../genre/infra/db/in-memory/genre-in-memory.repository';
import { GenresIdExistsInDatabaseValidator } from '../../../../../genre/application/validations/genres-ids-exists-in-database.validator';
import { UnitOfWorkFakeInMemory } from '../../../../../shared/infra/db/in-memory/fake-unit-of-work-in-memory';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { Video, VideoId } from '../../../../domain/video.aggregate';
import { VideoInMemoryRepository } from '../../../../infra/db/in-memory/video-in-memory.repository';
import { UpdateVideoUseCase } from '../update-video.use-case';

describe('UpdateVideoUseCase Unit Tests', () => {
  let useCase: UpdateVideoUseCase;
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

    useCase = new UpdateVideoUseCase(
      uow,
      videoRepo,
      categoriesIdValidator,
      genresIdValidator,
      castMembersIdValidator,
    );
  });

  it('should throw NotFoundError when video not found', async () => {
    const videoId = new VideoId();
    await expect(() =>
      useCase.execute({
        id: videoId.id,
        title: 'new title',
      }),
    ).rejects.toThrow(new NotFoundError(videoId.id, Video));
  });

  it('should update a video', async () => {
    const video = Video.fake().aVideoWithoutMedias().build();
    videoRepo.items = [video];

    const output = await useCase.execute({
      id: video.video_id.id,
      title: 'title updated',
    });

    expect(output).toStrictEqual({ id: video.video_id.id });
    const updatedVideo = await videoRepo.findById(video.video_id);
    expect(updatedVideo!.title).toBe('title updated');
  });
});
