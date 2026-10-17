import { RatingValues } from '../../../core/video/domain/rating.vo';
import { VideoId } from '../../../core/video/domain/video.aggregate';
import { CreateVideoUseCase } from '../../../core/video/application/use-cases/create-video/create-video.use-case';
import { UpdateVideoUseCase } from '../../../core/video/application/use-cases/update-video/update-video.use-case';
import { GetVideoUseCase } from '../../../core/video/application/use-cases/get-video/get-video.use-case';
import { DeleteVideoUseCase } from '../../../core/video/application/use-cases/delete-video/delete-video.use-case';
import { Test, TestingModule } from '@nestjs/testing';
import { IVideoRepository } from '../../../core/video/domain/video.repository';
import { ICategoryRepository } from '../../../core/category/domain/category.repository';
import { IGenreRepository } from '../../../core/genre/domain/genre.repository';
import { ICastMemberRepository } from '../../../core/cast-member/domain/cast-member.repository';
import { VideosController } from '../videos.controller';
import { VideosModule } from '../videos.module';
import { ListVideosUseCase } from '../../../core/video/application/use-cases/list-videos/list-videos.use-case';
import { DatabaseModule } from '../../database-module/database.module';
import { ConfigModule } from '../../config-module/config.module';
import { UnitOfWorkSequelize } from '../../../core/shared/infra/db/sequelize/unit-of-work-sequelize';
import { Sequelize } from 'sequelize-typescript';
import { getConnectionToken } from '@nestjs/sequelize';
import { VIDEOS_PROVIDERS } from '../videos.providers';
import { CATEGORY_PROVIDERS } from '../../categories-module/categories.providers';
import { GENRES_PROVIDERS } from '../../genres-module/genres.providers';
import { CAST_MEMBERS_PROVIDERS } from '../../cast-members-module/cast-members.providers';
import { AuthModule } from 'src/nest-modules/auth-module/auth.module';
import { Video } from '../../../core/video/domain/video.aggregate';
import { Category } from '../../../core/category/domain/category.aggregate';
import { Genre } from '../../../core/genre/domain/genre.aggregate';
import { CastMember } from '../../../core/cast-member/domain/cast-member.aggregate';
import { SharedModule } from '../../shared-module/shared.module';
import { EventModule } from '../../event-module/event.module';
import { UseCaseModule } from '../../use-case-module/use-case.module';
import { RabbitmqModule } from '../../rabbitmq-module/rabbitmq.module';

describe('VideosController Integration Tests', () => {
  let controller: VideosController;
  let videoRepo: IVideoRepository;
  let categoryRepo: ICategoryRepository;
  let genreRepo: IGenreRepository;
  let castMemberRepo: ICastMemberRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        // Configuração é o conjunto de parâmetros e opções que determinam o comportamento de um sistema ou aplicação, geralmente definidos fora do código-fonte, como variáveis de ambiente ou arquivos de configuração.
        // Parâmetro é um valor necessário para o funcionamento de uma funcionalidade; opção é um ajuste que altera ou ativa/desativa comportamentos específicos, geralmente sendo facultativo.
        ConfigModule.forRoot(),
        SharedModule,
        DatabaseModule,
        EventModule,
        UseCaseModule,
        RabbitmqModule.forRoot(),
        AuthModule,
        VideosModule,
      ],
    })
      // Fazemos override para garantir uma instância única do UnitOfWork nos testes e evitar conflitos com outros testes.
      .overrideProvider('UnitOfWork')
      .useFactory({
        factory: (sequelize: Sequelize) => {
          return new UnitOfWorkSequelize(sequelize);
        },
        inject: [getConnectionToken()],
      })
      .compile();
    await module.init();
    controller = module.get(VideosController);
    videoRepo = module.get(
      VIDEOS_PROVIDERS.REPOSITORIES.VIDEO_REPOSITORY.provide,
    );
    categoryRepo = module.get(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
    genreRepo = module.get(
      GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
    );
    castMemberRepo = module.get(
      CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
    );
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['listUseCase']).toBeInstanceOf(ListVideosUseCase);
    expect(controller['createUseCase']).toBeInstanceOf(CreateVideoUseCase);
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateVideoUseCase);
    expect(controller['getUseCase']).toBeInstanceOf(GetVideoUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteVideoUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteVideoUseCase);
  });

  it('should search videos', async () => {
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

    const presenter = await controller.search({});
    expect(presenter.meta.total).toBe(1);
    expect(presenter.data[0].id).toBe(video.video_id.id);
  });

  it('should delete a video', async () => {
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

    await controller.remove(video.video_id.id);

    await expect(videoRepo.findById(video.video_id)).resolves.toBeNull();
  });

  it('should create a video', async () => {
    const category = Category.fake().aCategory().build();
    const genre = Genre.fake().aGenre().addCategoryId(category.category_id).build();
    const castMember = CastMember.fake().anActor().build();
    await categoryRepo.insert(category);
    await genreRepo.insert(genre);
    await castMemberRepo.insert(castMember);

    const presenter = await controller.create({
      title: 'Test video',
      description: 'test description',
      year_launched: 2022,
      duration: 120,
      rating: RatingValues.R10,
      is_opened: true,
      categories_id: [category.category_id.id],
      genres_id: [genre.genre_id.id],
      cast_members_id: [castMember.cast_member_id.id],
    });

    const video = await videoRepo.findById(new VideoId(presenter.id));
    expect(video).toBeDefined();
    expect(video!.title).toBe('Test video');
  });

  it('should get a video', async () => {
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

    const presenter = await controller.findOne(video.video_id.id);
    expect(presenter.id).toBe(video.video_id.id);
    expect(presenter.title).toBe(video.title);
  });

  it('should update a video', async () => {
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

    await controller.update(video.video_id.id, {
      title: 'Updated title',
    });

    const updatedVideo = await videoRepo.findById(video.video_id);
    expect(updatedVideo!.title).toBe('Updated title');
  });

});