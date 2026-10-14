import { CastMember } from '../../../../../cast-member/domain/cast-member.aggregate';
import { CastMemberInMemoryRepository } from '../../../../../cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { Category } from '../../../../../category/domain/category.aggregate';
import { CategoryInMemoryRepository } from '../../../../../category/infra/db/in-memory/category-in-memory.repository';
import { Genre } from '../../../../../genre/domain/genre.aggregate';
import { GenreInMemoryRepository } from '../../../../../genre/infra/db/in-memory/genre-in-memory.repository';
import { Video } from '../../../../domain/video.aggregate';
import { VideoInMemoryRepository } from '../../../../infra/db/in-memory/video-in-memory.repository';
import { ListVideosUseCase } from '../list-videos.use-case';

describe('ListVideosUseCase Unit Tests', () => {
  let useCase: ListVideosUseCase;
  let videoRepo: VideoInMemoryRepository;
  let categoryRepo: CategoryInMemoryRepository;
  let genreRepo: GenreInMemoryRepository;
  let castMemberRepo: CastMemberInMemoryRepository;
  let categories: Category[];
  let genres: Genre[];
  let castMembers: CastMember[];
  let videos: Video[];

  beforeEach(async () => {
    videoRepo = new VideoInMemoryRepository();
    categoryRepo = new CategoryInMemoryRepository();
    genreRepo = new GenreInMemoryRepository();
    castMemberRepo = new CastMemberInMemoryRepository();
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
      makeVideo('alpha', categories[0], genres[0], castMembers[0], 0),
      makeVideo('beta', categories[1], genres[1], castMembers[1], 1),
      makeVideo('alpha sequel', categories[0], genres[1], castMembers[0], 2),
      makeVideo('delta', categories[2], genres[0], castMembers[1], 3),
    ];

    await categoryRepo.bulkInsert(categories);
    await genreRepo.bulkInsert(genres);
    await castMemberRepo.bulkInsert(castMembers);
    await videoRepo.bulkInsert(videos);
  });

  it('lists videos with default pagination and association output', async () => {
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
    expect(output.items[0].genres).toHaveLength(1);
    expect(output.items[0].cast_members).toHaveLength(1);
  });

  it('filters independently and combines category, genre, and cast member IDs', async () => {
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
      [videos[0], videos[3]].map((video) => video.video_id.id).sort(),
    );

    const byCastMember = await useCase.execute({
      filter: { cast_members_id: [castMembers[0].cast_member_id.id] },
    });
    expect(byCastMember.items.map((item) => item.id).sort()).toEqual(
      [videos[0], videos[2]].map((video) => video.video_id.id).sort(),
    );

    const twoTypes = await useCase.execute({
      filter: {
        categories_id: [categories[0].category_id.id],
        genres_id: [genres[1].genre_id.id],
      },
    });
    expect(twoTypes.items.map((item) => item.id)).toEqual([
      videos[2].video_id.id,
    ]);

    const combined = await useCase.execute({
      page: 1,
      per_page: 1,
      filter: {
        categories_id: [categories[0].category_id.id, categories[2].category_id.id],
        genres_id: genres.map((genre) => genre.genre_id.id),
        cast_members_id: [castMembers[0].cast_member_id.id],
      },
    });
    expect(combined.items.map((item) => item.id)).toEqual([
      videos[2].video_id.id,
    ]);
    expect(combined.total).toBe(2);
    expect(combined.last_page).toBe(2);
  });

  it('combines title search with filters and treats empty lists as omitted', async () => {
    const filtered = await useCase.execute({
      filter: {
        title: 'alpha',
        categories_id: [categories[0].category_id.id],
        genres_id: [genres[0].genre_id.id, genres[1].genre_id.id],
        cast_members_id: [castMembers[0].cast_member_id.id],
      },
    });
    expect(filtered.items.map((item) => item.id).sort()).toEqual(
      [videos[0], videos[2]].map((video) => video.video_id.id).sort(),
    );

    const emptyLists = await useCase.execute({
      filter: { categories_id: [], genres_id: [], cast_members_id: [] },
    });
    expect(emptyLists.total).toBe(4);
  });

  it('keeps page items and total aligned and returns no matches for unknown IDs', async () => {
    const page = await useCase.execute({
      page: 2,
      per_page: 1,
      filter: { categories_id: [categories[0].category_id.id] },
    });
    expect(page.items.map((item) => item.id)).toEqual([
      videos[0].video_id.id,
    ]);
    expect(page.total).toBe(2);
    expect(page.last_page).toBe(2);

    const noMatches = await useCase.execute({
      filter: { categories_id: ['00000000-0000-4000-8000-000000000000'] },
    });
    expect(noMatches).toMatchObject({
      items: [],
      total: 0,
      current_page: 1,
      last_page: 0,
    });
  });
});

function makeVideo(
  title: string,
  category: Category,
  genre: Genre,
  castMember: CastMember,
  index: number,
) {
  return Video.fake()
    .aVideoWithoutMedias()
    .withTitle(title)
    .withCreatedAt(new Date(Date.UTC(2020, 0, index + 1)))
    .addCategoryId(category.category_id)
    .addGenreId(genre.genre_id)
    .addCastMemberId(castMember.cast_member_id)
    .build();
}
