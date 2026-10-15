import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { InvalidUuidError } from "../../../../../shared/domain/value-objects/uuid.vo";
import { Video, VideoId } from "../../../../domain/video.aggregate";
import { VideoInMemoryRepository } from "../../../../infra/db/in-memory/video-in-memory.repository";
import { DeleteVideoUseCase } from "../delete-video.use-case";

describe("DeleteVideoUseCase Unit Tests", () => {
  let useCase: DeleteVideoUseCase;
  let repository: VideoInMemoryRepository;

  beforeEach(() => {
    repository = new VideoInMemoryRepository();
    useCase = new DeleteVideoUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() =>
      useCase.execute({ id: "fake id"})
    ).rejects.toThrow(new InvalidUuidError());

    const videoId = new VideoId();

    await expect(() =>
      useCase.execute({ id: videoId.id})
    ).rejects.toThrow(new NotFoundError(videoId.id, Video));
  });

  it("should delete a video", async () => {
    const video = Video.fake().aVideoWithoutMedias().build();
    repository.items = [video];
    await useCase.execute({
      id: video.video_id.id,
    });
    expect(repository.items).toHaveLength(0);
  });
});
