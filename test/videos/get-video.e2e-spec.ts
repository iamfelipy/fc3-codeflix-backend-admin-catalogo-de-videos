import request from 'supertest';
import { IVideoRepository } from '../../src/core/video/domain/video.repository';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { VIDEOS_PROVIDERS } from '../../src/nest-modules/videos-module/videos.providers';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers';
import { Category } from '../../src/core/category/domain/category.aggregate';
import { IGenreRepository } from '../../src/core/genre/domain/genre.repository';
import { GENRES_PROVIDERS } from '../../src/nest-modules/genres-module/genres.providers';
import { Genre } from '../../src/core/genre/domain/genre.aggregate';
import { ICastMemberRepository } from '../../src/core/cast-member/domain/cast-member.repository';
import { CAST_MEMBERS_PROVIDERS } from '../../src/nest-modules/cast-members-module/cast-members.providers';
import { CastMember } from '../../src/core/cast-member/domain/cast-member.aggregate';
import { Video } from '../../src/core/video/domain/video.aggregate';

describe('VideosController (e2e)', () => {
  describe('/videos/:id (GET)', () => {
    const nestApp = startApp();

    describe('unauthenticated', () => {
      const app = startApp();

      test('should return 401 when not authenticated', () => {
        return request(app.app.getHttpServer())
          .get('/videos/88ff2587-ce5a-4769-a8c6-1d63d29c5f7a')
          .expect(401);
      });

      test('should return 403 when not authenticated as admin', () => {
        return request(app.app.getHttpServer())
          .get('/videos/88ff2587-ce5a-4769-a8c6-1d63d29c5f7a')
          .authenticate(app.app, false)
          .expect(403);
      });
    });

    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message:
              'Video Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .get(`/videos/${id}`)
          .authenticate(nestApp.app, true)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should return a video response with status 200', async () => {
      const videoRepo = nestApp.app.get<IVideoRepository>(
        VIDEOS_PROVIDERS.REPOSITORIES.VIDEO_REPOSITORY.provide,
      );
      const categoryRepo = nestApp.app.get<ICategoryRepository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
      const genreRepo = nestApp.app.get<IGenreRepository>(
        GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      );
      const castMemberRepo = nestApp.app.get<ICastMemberRepository>(
        CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );

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

      const res = await request(nestApp.app.getHttpServer())
        .get(`/videos/${video.video_id.id}`)
        .authenticate(nestApp.app, true)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data.id).toBe(video.video_id.id);
      expect(res.body.data.title).toBe(video.title);
    });
  });
});
