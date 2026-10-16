import request from 'supertest';
import { IVideoRepository } from '../../src/core/video/domain/video.repository';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { IGenreRepository } from '../../src/core/genre/domain/genre.repository';
import { ICastMemberRepository } from '../../src/core/cast-member/domain/cast-member.repository';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { VIDEOS_PROVIDERS } from '../../src/nest-modules/videos-module/videos.providers';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers';
import { GENRES_PROVIDERS } from '../../src/nest-modules/genres-module/genres.providers';
import { CAST_MEMBERS_PROVIDERS } from '../../src/nest-modules/cast-members-module/cast-members.providers';
import { Video } from '../../src/core/video/domain/video.aggregate';
import { Category } from '../../src/core/category/domain/category.aggregate';
import { Genre } from '../../src/core/genre/domain/genre.aggregate';
import { CastMember } from '../../src/core/cast-member/domain/cast-member.aggregate';

describe('VideosController (e2e)', () => {
  describe('/videos (GET)', () => {
    let videoRepo: IVideoRepository;
    let categoryRepo: ICategoryRepository;
    let genreRepo: IGenreRepository;
    let castMemberRepo: ICastMemberRepository;
    const nestApp = startApp();

    beforeEach(async () => {
      videoRepo = nestApp.app.get<IVideoRepository>(
        VIDEOS_PROVIDERS.REPOSITORIES.VIDEO_REPOSITORY.provide,
      );
      categoryRepo = nestApp.app.get<ICategoryRepository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
      genreRepo = nestApp.app.get<IGenreRepository>(
        GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      );
      castMemberRepo = nestApp.app.get<ICastMemberRepository>(
        CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );
    });

    it('should return videos list', async () => {
      const category = Category.fake().aCategory().build();
      const genre = Genre.fake().aGenre().addCategoryId(category.category_id).build();
      const castMember = CastMember.fake().anActor().build();
      await categoryRepo.insert(category);
      await genreRepo.insert(genre);
      await castMemberRepo.insert(castMember);

      const video = Video.fake()
        .aVideoWithoutMedias()
        .addCategoryId(category.category_id)
        .addGenreId(genre.genre_id)
        .addCastMemberId(castMember.cast_member_id)
        .build();
      await videoRepo.insert(video);

      const response = await request(nestApp.app.getHttpServer())
        .get('/videos')
        .authenticate(nestApp.app, true)
        .expect(200);

      expect(response.body.meta.total).toBe(1);
      expect(response.body.data[0].id).toBe(video.video_id.id);
    });
  });
});
