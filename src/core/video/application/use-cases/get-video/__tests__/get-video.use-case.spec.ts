import { CastMemberInMemoryRepository } from '../../../../../cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { CategoryInMemoryRepository } from '../../../../../category/infra/db/in-memory/category-in-memory.repository';
import { GenreInMemoryRepository } from '../../../../../genre/infra/db/in-memory/genre-in-memory.repository';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { Video, VideoId } from '../../../../domain/video.aggregate';
import { VideoInMemoryRepository } from '../../../../infra/db/in-memory/video-in-memory.repository';
import { GetVideoUseCase } from '../get-video.use-case';

describe('GetVideoUseCase Unit Tests', () => {
  let useCase: GetVideoUseCase;
  let videoRepo: VideoInMemoryRepository;
  let categoryRepo: CategoryInMemoryRepository;
  let genreRepo: GenreInMemoryRepository;
  let castMemberRepo: CastMemberInMemoryRepository;

  beforeEach(() => {
    videoRepo = new VideoInMemoryRepository();
    categoryRepo = new CategoryInMemoryRepository();
    genreRepo = new GenreInMemoryRepository();
    castMemberRepo = new CastMemberInMemoryRepository();
    useCase = new GetVideoUseCase(
      videoRepo,
      categoryRepo,
      genreRepo,
      castMemberRepo,
    );
  });

  it('should throw NotFoundError when video not found', async () => {
    const videoId = new VideoId();
    await expect(() => useCase.execute({ id: videoId.id })).rejects.toThrow(
      new NotFoundError(videoId.id, Video),
    );
  });

  it('should get a video', async () => {
    const video = Video.fake().aVideoWithoutMedias().build();
    videoRepo.items = [video];

    const output = await useCase.execute({ id: video.video_id.id });
    expect(output).toStrictEqual({
      id: video.video_id.id,
      title: video.title,
      description: video.description,
      year_launched: video.year_launched,
      duration: video.duration,
      rating: video.rating.value,
      is_opened: video.is_opened,
      is_published: video.is_published,
      categories: [],
      categories_id: Array.from(video.categories_id.values()).map((c) => c.id),
      genres: [],
      genres_id: Array.from(video.genres_id.values()).map((g) => g.id),
      cast_members: [],
      cast_members_id: Array.from(video.cast_members_id.values()).map(
        (cm) => cm.id,
      ),
      created_at: video.created_at,
    });
  });
});
