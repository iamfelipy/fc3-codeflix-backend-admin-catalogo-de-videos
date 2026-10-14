import { ICastMemberRepository } from '../../../../cast-member/domain/cast-member.repository';
import { ICategoryRepository } from '../../../../category/domain/category.repository';
import { CategoryId } from '../../../../category/domain/category.aggregate';
import { IGenreRepository } from '../../../../genre/domain/genre.repository';
import { PaginationOutput, PaginationOutputMapper } from '../../../../shared/application/pagination-output';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { IVideoRepository, VideoSearchParams } from '../../../domain/video.repository';
import { VideoOutput, VideoOutputMapper } from '../common/video-output';
import { ListVideosInput } from './list-videos.input';

export class ListVideosUseCase implements IUseCase<ListVideosInput, ListVideosOutput> {
  constructor(
    private videoRepo: IVideoRepository,
    private categoryRepo: ICategoryRepository,
    private genreRepo: IGenreRepository,
    private castMemberRepo: ICastMemberRepository,
  ) {}

  async execute(input: ListVideosInput): Promise<ListVideosOutput> {
    const searchResult = await this.videoRepo.search(VideoSearchParams.create(input));
    const genres = await this.genreRepo.findByIds(
      // flatmap -> transformar array de arrays em array de um nivel
      searchResult.items.flatMap((video) => Array.from(video.genres_id.values())),
    );
    const categoryIds = searchResult.items
      .flatMap((video) => Array.from(video.categories_id.values()))
      .concat(genres.flatMap((genre) => Array.from(genre.categories_id.values())));
    const categories = await this.categoryRepo.findByIds(
      Array.from(new Map(categoryIds.map((id) => [id.id, id])).values()) as CategoryId[],
    );
    const castMembers = await this.castMemberRepo.findByIds(
      searchResult.items.flatMap((video) => Array.from(video.cast_members_id.values())),
    );
    const items = searchResult.items.map((video) =>
      VideoOutputMapper.toOutput({
        video,
        genres,
        cast_members: castMembers,
        allCategoriesOfVideoAndGenre: categories,
      }),
    );
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListVideosOutput = PaginationOutput<VideoOutput>;
