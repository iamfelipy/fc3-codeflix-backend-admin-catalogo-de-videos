import { CastMember } from "../../../../../cast-member/domain/cast-member.aggregate";
import { CastMemberModel, CastMemberSequelizeRepository } from "../../../../../cast-member/infra/db/sequelize/cast-member-sequelize";
import { Category } from "../../../../../category/domain/category.aggregate";
import { CategorySequelizeRepository } from "../../../../../category/infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../../category/infra/db/sequelize/category.model";
import { Genre } from "../../../../../genre/domain/genre.aggregate";
import { GenreModel } from "../../../../../genre/infra/db/sequelize/genre-model";
import { GenreSequelizeRepository } from "../../../../../genre/infra/db/sequelize/genre-sequelize.repository";
import { UnitOfWorkSequelize } from "../../../../../shared/infra/db/sequelize/unit-of-work-sequelize";
import { AudioVideoMediaStatus } from "../../../../../shared/domain/value-objects/audio-video-media.vo";
import { Video } from "../../../../domain/video.aggregate";
import { VideoSequelizeRepository } from "../../../../infra/db/sequelize/video-sequelize.repository";
import { setupSequelizeForVideo } from "../../../../infra/db/sequelize/testing/helpers";
import { VideoModel } from "../../../../infra/db/sequelize/video.model";
import { ProcessAudioVideoMediasUseCase } from "../process-audio-video-medias.use-case";

describe("ProcessAudioVideoMediasUseCase Integration Tests", () => {
  const sequelizeHelper = setupSequelizeForVideo();
  let useCase: ProcessAudioVideoMediasUseCase;
  let videoRepo: VideoSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;
  let genreRepo: GenreSequelizeRepository;
  let castMemberRepo: CastMemberSequelizeRepository;
  let uow: UnitOfWorkSequelize;

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    videoRepo = new VideoSequelizeRepository(VideoModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    castMemberRepo = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new ProcessAudioVideoMediasUseCase(uow, videoRepo);
  });

  it("should process trailer media status completed", async () => {
    const category = Category.fake().aCategory().build();
    await categoryRepo.insert(category);
    const genre = Genre.fake().aGenre().addCategoryId(category.category_id).build();
    await genreRepo.insert(genre);
    const castMember = CastMember.fake().anActor().build();
    await castMemberRepo.insert(castMember);

    const video = Video.fake()
      .aVideoWithAllMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .addCastMemberId(castMember.cast_member_id)
      .build();
    await videoRepo.insert(video);

    await useCase.execute({
      video_id: video.video_id.id,
      field: "trailer",
      status: AudioVideoMediaStatus.COMPLETED,
      encoded_location: "encoded_path",
    });

    const updated = await videoRepo.findById(video.video_id);
    expect(updated!.trailer!.status).toBe(AudioVideoMediaStatus.COMPLETED);
    expect(updated!.trailer!.encoded_location).toBe("encoded_path");
  });
});
