import { ApplicationService } from '@core/shared/application/application.service';
import { UnitOfWorkFakeInMemory } from '../../../../../shared/infra/db/in-memory/fake-unit-of-work-in-memory';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { InMemoryStorage } from '../../../../../shared/infra/storage/in-memory.storage';
import { Video, VideoId } from '../../../../domain/video.aggregate';
import { VideoInMemoryRepository } from '../../../../infra/db/in-memory/video-in-memory.repository';
import { UploadAudioVideoMediasUseCase } from '../upload-audio-video-medias.use-case';
import { DomainEventMediator } from '@core/shared/domain/events/domain-event-mediator';
import EventEmitter2 from 'eventemitter2';

describe('UploadAudioVideoMediasUseCase Unit Tests', () => {
  let useCase: UploadAudioVideoMediasUseCase;
  let domainEventMediator: DomainEventMediator;
  let uow: UnitOfWorkFakeInMemory;
  let appService: ApplicationService;
  let videoRepo: VideoInMemoryRepository;
  let storage: InMemoryStorage;

  beforeEach(() => {
    uow = new UnitOfWorkFakeInMemory();
    domainEventMediator = new DomainEventMediator(new EventEmitter2());
    appService = new ApplicationService(uow, domainEventMediator);
    videoRepo = new VideoInMemoryRepository();
    storage = new InMemoryStorage();
    useCase = new UploadAudioVideoMediasUseCase(appService, videoRepo, storage);
  });

  it('should throw NotFoundError when video not found', async () => {
    const videoId = new VideoId();
    await expect(() =>
      useCase.execute({
        video_id: videoId.id,
        field: 'trailer',
        file: {
          raw_name: 'trailer.mp4',
          data: Buffer.from('test'),
          mime_type: 'video/mp4',
          size: 100,
        },
      }),
    ).rejects.toThrow(new NotFoundError(videoId.id, Video));
  });

  it('should upload trailer media', async () => {
    const video = Video.fake().aVideoWithoutMedias().build();
    videoRepo.items = [video];
    const spyStore = jest.spyOn(storage, 'store');

    await useCase.execute({
      video_id: video.video_id.id,
      field: 'trailer',
      file: {
        raw_name: 'trailer.mp4',
        data: Buffer.from('test'),
        mime_type: 'video/mp4',
        size: 100,
      },
    });

    expect(spyStore).toHaveBeenCalledTimes(1);
    const updated = await videoRepo.findById(video.video_id);
    expect(updated!.trailer).toBeDefined();
  });
});
