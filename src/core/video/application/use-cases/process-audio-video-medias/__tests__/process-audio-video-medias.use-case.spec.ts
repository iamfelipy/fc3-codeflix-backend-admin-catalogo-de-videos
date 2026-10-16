import { UnitOfWorkFakeInMemory } from '../../../../../shared/infra/db/in-memory/fake-unit-of-work-in-memory';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { AudioVideoMediaStatus } from '../../../../../shared/domain/value-objects/audio-video-media.vo';
import { Video, VideoId } from '../../../../domain/video.aggregate';
import { VideoInMemoryRepository } from '../../../../infra/db/in-memory/video-in-memory.repository';
import { ProcessAudioVideoMediasUseCase } from '../process-audio-video-medias.use-case';

describe('ProcessAudioVideoMediasUseCase Unit Tests', () => {
  let useCase: ProcessAudioVideoMediasUseCase;
  let uow: UnitOfWorkFakeInMemory;
  let videoRepo: VideoInMemoryRepository;

  beforeEach(() => {
    uow = new UnitOfWorkFakeInMemory();
    videoRepo = new VideoInMemoryRepository();
    useCase = new ProcessAudioVideoMediasUseCase(uow, videoRepo);
  });

  it('should throw NotFoundError when video not found', async () => {
    const videoId = new VideoId();
    await expect(() =>
      useCase.execute({
        video_id: videoId.id,
        field: 'trailer',
        status: AudioVideoMediaStatus.COMPLETED,
        encoded_location: 'path',
      }),
    ).rejects.toThrow(new NotFoundError(videoId.id, Video));
  });

  it('should process trailer media status completed', async () => {
    const video = Video.fake().aVideoWithAllMedias().build();
    videoRepo.items = [video];

    await useCase.execute({
      video_id: video.video_id.id,
      field: 'trailer',
      status: AudioVideoMediaStatus.COMPLETED,
      encoded_location: 'encoded_path',
    });

    const updated = await videoRepo.findById(video.video_id);
    expect(updated!.trailer!.status).toBe(AudioVideoMediaStatus.COMPLETED);
    expect(updated!.trailer!.encoded_location).toBe('encoded_path');
  });
});
