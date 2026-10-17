import request from 'supertest';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers';
import { Category } from '../../src/core/category/domain/category.aggregate';
import { IGenreRepository } from '../../src/core/genre/domain/genre.repository';
import { GENRES_PROVIDERS } from '../../src/nest-modules/genres-module/genres.providers';
import { Genre } from '../../src/core/genre/domain/genre.aggregate';
import { ICastMemberRepository } from '../../src/core/cast-member/domain/cast-member.repository';
import { CAST_MEMBERS_PROVIDERS } from '../../src/nest-modules/cast-members-module/cast-members.providers';
import { CastMember } from '../../src/core/cast-member/domain/cast-member.aggregate';
import { RatingValues } from '../../src/core/video/domain/rating.vo';

describe('VideosController (e2e)', () => {
  describe('/videos (POST)', () => {
    const nestApp = startApp();

    describe('unauthenticated', () => {
      const app = startApp();

      test('should return 401 when not authenticated', () => {
        return request(app.app.getHttpServer())
          .post('/videos')
          .send({})
          .expect(401);
      });

      test('should return 403 when not authenticated as admin', () => {
        return request(app.app.getHttpServer())
          .post('/videos')
          .authenticate(app.app, false)
          .send({})
          .expect(403);
      });
    });

    it('should create a video response with status 201', async () => {
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

      const sendData = {
        title: 'Test video',
        description: 'test description',
        year_launched: 2022,
        duration: 120,
        rating: RatingValues.R10,
        is_opened: true,
        categories_id: [category.category_id.id],
        genres_id: [genre.genre_id.id],
        cast_members_id: [castMember.cast_member_id.id],
      };

      const res = await request(nestApp.app.getHttpServer())
        .post('/videos')
        .authenticate(nestApp.app, true)
        .send(sendData)
        .expect(201);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe(sendData.title);
    });
  });
});
