import { CastMember } from "../../../../../cast-member/domain/cast-member.aggregate";
import { CastMemberModel, CastMemberSequelizeRepository } from "../../../../../cast-member/infra/db/sequelize/cast-member-sequelize";
import { Category } from "../../../../../category/domain/category.aggregate";
import { CategorySequelizeRepository } from "../../../../../category/infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../../category/infra/db/sequelize/category.model";
import { Genre } from "../../../../../genre/domain/genre.aggregate";
import { GenreModel } from "../../../../../genre/infra/db/sequelize/genre-model";
import { GenreSequelizeRepository } from "../../../../../genre/infra/db/sequelize/genre-sequelize.repository";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { UnitOfWorkSequelize } from "../../../../../shared/infra/db/sequelize/unit-of-work-sequelize";
import { Video, VideoId } from "../../../../domain/video.aggregate";
import { VideoSequelizeRepository } from "../../../../infra/db/sequelize/video-sequelize.repository";
import { setupSequelizeForVideo } from "../../../../infra/db/sequelize/testing/helpers";
import {
  VideoCastMemberModel,
  VideoCategoryModel,
  VideoGenreModel,
  VideoModel,
} from "../../../../infra/db/sequelize/video.model";
import { DeleteVideoUseCase } from "../delete-video.use-case";

describe("DeleteVideoUseCase Integration Tests", () => {
  const sequelizeHelper = setupSequelizeForVideo();
  let useCase: DeleteVideoUseCase;
  let videoRepo: VideoSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;
  let genreRepo: GenreSequelizeRepository;
  let castMemberRepo: CastMemberSequelizeRepository;
  let uow: UnitOfWorkSequelize;

  beforeEach(async () => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    videoRepo = new VideoSequelizeRepository(VideoModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    castMemberRepo = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new DeleteVideoUseCase(videoRepo);
  });

  it("should throws error when entity not found", async () => {
    const videoId = new VideoId();
    await expect(() => useCase.execute({ id: videoId.id })).rejects.toThrow(
      new NotFoundError(videoId.id, Video)
    );
  });

  it("should delete a video", async () => {
    const category = Category.fake().aCategory().build();
    await categoryRepo.insert(category);
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.insert(genre);
    const castMember = CastMember.fake().aCastMember().build();
    await castMemberRepo.insert(castMember);

    const video = Video.fake()
      .aVideoWithoutMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .addCastMemberId(castMember.cast_member_id)
      .build();
    await videoRepo.insert(video);

    await useCase.execute({
      id: video.video_id.id,
    });

    await expect(videoRepo.findById(video.video_id)).resolves.toBeNull();
    await expect(VideoCategoryModel.count()).resolves.toBe(0);
    await expect(VideoGenreModel.count()).resolves.toBe(0);
    await expect(VideoCastMemberModel.count()).resolves.toBe(0);
  });
});
