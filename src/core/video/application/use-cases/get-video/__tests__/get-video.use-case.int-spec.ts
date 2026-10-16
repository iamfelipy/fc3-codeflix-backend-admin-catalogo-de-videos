import { CastMember } from "../../../../../cast-member/domain/cast-member.aggregate";
import { CastMemberModel, CastMemberSequelizeRepository } from "../../../../../cast-member/infra/db/sequelize/cast-member-sequelize";
import { Category } from "../../../../../category/domain/category.aggregate";
import { CategorySequelizeRepository } from "../../../../../category/infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../../category/infra/db/sequelize/category.model";
import { Genre } from "../../../../../genre/domain/genre.aggregate";
import { GenreModel } from "../../../../../genre/infra/db/sequelize/genre-model";
import { GenreSequelizeRepository } from "../../../../../genre/infra/db/sequelize/genre-sequelize.repository";
import { UnitOfWorkSequelize } from "../../../../../shared/infra/db/sequelize/unit-of-work-sequelize";
import { Video } from "../../../../domain/video.aggregate";
import { VideoSequelizeRepository } from "../../../../infra/db/sequelize/video-sequelize.repository";
import { setupSequelizeForVideo } from "../../../../infra/db/sequelize/testing/helpers";
import { VideoModel } from "../../../../infra/db/sequelize/video.model";
import { GetVideoUseCase } from "../get-video.use-case";

describe("GetVideoUseCase Integration Tests", () => {
  const sequelizeHelper = setupSequelizeForVideo();
  let useCase: GetVideoUseCase;
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
    useCase = new GetVideoUseCase(
      videoRepo,
      categoryRepo,
      genreRepo,
      castMemberRepo
    );
  });

  it("should get a video", async () => {
    const category = Category.fake().aCategory().build();
    await categoryRepo.insert(category);
    const genre = Genre.fake().aGenre().addCategoryId(category.category_id).build();
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

    const output = await useCase.execute({ id: video.video_id.id });
    expect(output.id).toBe(video.video_id.id);
  });
});
