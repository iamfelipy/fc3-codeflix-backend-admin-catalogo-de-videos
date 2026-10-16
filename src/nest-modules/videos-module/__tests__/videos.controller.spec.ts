import { VideosController } from '../videos.controller';
import { VideoCollectionPresenter } from '../videos.presenter';
import { ListVideosOutput } from '../../../core/video/application/use-cases/list-videos/list-videos.use-case';
import { RatingValues } from '../../../core/video/domain/rating.vo';

describe('VideosController Unit Tests', () => {
  let controller: VideosController;

  beforeEach(async () => {
    controller = new VideosController();
  });

  it('should search videos', async () => {
    const output: ListVideosOutput = {
      items: [
        {
          id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          title: 'Test video',
          description: 'test description',
          year_launched: 2022,
          duration: 120,
          rating: RatingValues.R10,
          is_opened: true,
          is_published: true,
          categories_id: [],
          categories: [],
          genres_id: [],
          genres: [],
          cast_members_id: [],
          cast_members: [],
          created_at: new Date(),
        },
      ],
      total: 1,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    };
    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['listUseCase'] = mockListUseCase;
    const searchParams = { page: 1, per_page: 15 };
    const presenter = await controller.search(searchParams);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toBeInstanceOf(VideoCollectionPresenter);
    expect(presenter).toStrictEqual(new VideoCollectionPresenter(output));
  });

  it("should delete a video", async () => {
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(undefined)),
    };
    //@ts-expect-error defined part of methods
    controller["deleteUseCase"] = mockDeleteUseCase;
    const id = "9366b7dc-2d71-4799-b91c-c64adb205104";
    expect(await controller.remove(id)).toBeUndefined();
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
  });
});
