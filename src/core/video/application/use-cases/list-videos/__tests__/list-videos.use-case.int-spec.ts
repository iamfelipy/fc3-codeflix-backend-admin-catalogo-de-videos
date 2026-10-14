import { CastMember } from '../../../../../cast-member/domain/cast-member.aggregate';
import {
  CastMemberModel,
  CastMemberSequelizeRepository,
} from '../../../../../cast-member/infra/db/sequelize/cast-member-sequelize';
import { Category } from '../../../../../category/domain/category.aggregate';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { Genre } from '../../../../../genre/domain/genre.aggregate';
import {
  GenreCategoryModel,
  GenreModel,
} from '../../../../../genre/infra/db/sequelize/genre-model';
import { GenreSequelizeRepository } from '../../../../../genre/infra/db/sequelize/genre-sequelize.repository';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { setupSequelizeForVideo } from '../../../../infra/db/sequelize/testing/helpers';
import { Video } from '../../../../domain/video.aggregate';
import { VideoSequelizeRepository } from '../../../../infra/db/sequelize/video-sequelize.repository';
import {
  VideoCategoryModel,
  VideoCastMemberModel,
  VideoGenreModel,
  VideoModel,
} from '../../../../infra/db/sequelize/video.model';
import { ListVideosUseCase } from '../list-videos.use-case';

describe('ListVideosUseCase Integration Tests', () => {
  let useCase: ListVideosUseCase;
  let videoRepo: VideoSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;
  let genreRepo: GenreSequelizeRepository;
  let castMemberRepo: CastMemberSequelizeRepository;
  let categories: Category[];
  let genres: Genre[];
  let castMembers: CastMember[];
  let videos: Video[];

  const sequelizeHelper = setupSequelizeForVideo();

  beforeEach(async () => {
    const uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    videoRepo = new VideoSequelizeRepository(VideoModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    castMemberRepo = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new ListVideosUseCase(
      videoRepo,
      categoryRepo,
      genreRepo,
      castMemberRepo,
    );

    categories = Category.fake().theCategories(3).build();
    genres = [
      Genre.fake().aGenre().addCategoryId(categories[0].category_id).build(),
      Genre.fake().aGenre().addCategoryId(categories[1].category_id).build(),
    ];
    castMembers = CastMember.fake().theCastMembers(2).build();
    videos = [
      makeVideo('alpha', [categories[0]], [genres[0]], [castMembers[0]], 0),
      makeVideo('beta', [categories[1]], [genres[1]], [castMembers[1]], 1),
      makeVideo(
        'alpha sequel',
        [categories[0], categories[2]],
        genres,
        [castMembers[0]],
        2,
      ),
      makeVideo('delta', [categories[2]], [genres[0]], [castMembers[1]], 3),
    ];

    await categoryRepo.bulkInsert(categories);
    await genreRepo.bulkInsert(genres);
    await castMemberRepo.bulkInsert(castMembers);
    await videoRepo.bulkInsert(videos);
  });

  it('lists persisted videos with default pagination and related output', async () => {
    const output = await useCase.execute({});

    expect(output).toMatchObject({
      total: 4,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
    expect(output.items.map((item) => item.id)).toEqual(
      videos.slice().reverse().map((video) => video.video_id.id),
    );
    expect(output.items[1].genres).toHaveLength(2);
    expect(output.items[0].cast_members).toHaveLength(1);
  });

  it('applies each association filter and combines all filters without duplicate videos', async () => {
    const byCategory = await useCase.execute({
      filter: { categories_id: [categories[0].category_id.id] },
    });
    expect(byCategory.items.map((item) => item.id).sort()).toEqual(
      [videos[0], videos[2]].map((video) => video.video_id.id).sort(),
    );

    const byGenre = await useCase.execute({
      filter: { genres_id: [genres[0].genre_id.id] },
    });
    expect(byGenre.items.map((item) => item.id).sort()).toEqual(
      [videos[0], videos[2], videos[3]]
        .map((video) => video.video_id.id)
        .sort(),
    );

    const byCastMember = await useCase.execute({
      filter: { cast_members_id: [castMembers[0].cast_member_id.id] },
    });
    expect(byCastMember.items.map((item) => item.id).sort()).toEqual(
      [videos[0], videos[2]].map((video) => video.video_id.id).sort(),
    );

    const page = await useCase.execute({
      page: 1,
      per_page: 1,
      sort: 'created_at',
      sort_dir: 'desc',
      filter: {
        categories_id: [categories[0].category_id.id, categories[2].category_id.id],
        genres_id: genres.map((genre) => genre.genre_id.id),
        cast_members_id: [castMembers[0].cast_member_id.id],
      },
    });
    expect(page.items.map((item) => item.id)).toEqual([
      videos[2].video_id.id,
    ]);
    expect(page.items.map((item) => item.id)).toHaveLength(1);
    expect(page.total).toBe(2);
    expect(page.last_page).toBe(2);
  });

  it('treats empty association lists as omitted and keeps page totals aligned', async () => {
    const allVideos = await useCase.execute({
      filter: { categories_id: [], genres_id: [], cast_members_id: [] },
    });
    expect(allVideos.total).toBe(4);

    const secondPage = await useCase.execute({
      page: 2,
      per_page: 1,
      sort: 'created_at',
      sort_dir: 'desc',
      filter: { categories_id: [categories[0].category_id.id] },
    });
    expect(secondPage.items.map((item) => item.id)).toEqual([
      videos[0].video_id.id,
    ]);
    expect(secondPage.total).toBe(2);
    expect(secondPage.last_page).toBe(2);
  });
});

function makeVideo(
  title: string,
  categories: Category[],
  genres: Genre[],
  castMembers: CastMember[],
  index: number,
) {
  const builder = Video.fake()
    .aVideoWithoutMedias()
    .withTitle(title)
    .withCreatedAt(new Date(Date.UTC(2020, 0, index + 1)));
  categories.forEach((category) => builder.addCategoryId(category.category_id));
  genres.forEach((genre) => builder.addGenreId(genre.genre_id));
  castMembers.forEach((castMember) =>
    builder.addCastMemberId(castMember.cast_member_id),
  );
  return builder.build();
}
