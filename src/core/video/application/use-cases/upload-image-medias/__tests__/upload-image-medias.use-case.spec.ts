import { UnitOfWorkFakeInMemory } from '../../../../../shared/infra/db/in-memory/fake-unit-of-work-in-memory';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { InMemoryStorage } from '../../../../../shared/infra/storage/in-memory.storage';
import { Video, VideoId } from '../../../../domain/video.aggregate';
import { VideoInMemoryRepository } from '../../../../infra/db/in-memory/video-in-memory.repository';
import { UploadImageMediasUseCase } from '../upload-image-medias.use-case';

describe('UploadImageMediasUseCase Unit Tests', () => {
  let useCase: UploadImageMediasUseCase;
  let uow: UnitOfWorkFakeInMemory;
  let videoRepo: VideoInMemoryRepository;
  let storage: InMemoryStorage;

  beforeEach(() => {
    uow = new UnitOfWorkFakeInMemory();
    videoRepo = new VideoInMemoryRepository();
    storage = new InMemoryStorage();
    useCase = new UploadImageMediasUseCase(uow, videoRepo, storage);
  });

  it('should throw NotFoundError when video not found', async () => {
    const videoId = new VideoId();
    await expect(() =>
      useCase.execute({
        video_id: videoId.id,
        field: 'banner',
        file: {
          name: 'banner.jpg',
          raw_data: Buffer.from('test'),
          mime_type: 'image/jpeg',
          size: 100,
        } as any,
      }),
    ).rejects.toThrow(new NotFoundError(videoId.id, Video));
  });

  it('should upload banner image', async () => {
    const video = Video.fake().aVideoWithoutMedias().build();
    videoRepo.items = [video];
    const spyStore = jest.spyOn(storage, 'store');

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

    expect(spyStore).toHaveBeenCalledTimes(1);
    const updated = await videoRepo.findById(video.video_id);
    expect(updated!.banner).toBeDefined();
  });
});
