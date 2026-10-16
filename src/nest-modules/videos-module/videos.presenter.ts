import { Transform, Type } from 'class-transformer';
import { CollectionPresenter } from '../shared-module/collection.presenter';
import {
  VideoOutput,
  VideoCategoryOutput,
  VideoGenreOutput,
  VideoCastMemberOutput,
} from '../../core/video/application/use-cases/common/video-output';
import { RatingValues } from '../../core/video/domain/rating.vo';
import { CastMemberTypes } from '../../core/cast-member/domain/cast-member-type.vo';
import { ListVideosOutput } from '@core/video/application/use-cases/list-videos/list-videos.use-case';

export class VideoCategoryPresenter {
  id: string;
  name: string;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: VideoCategoryOutput) {
    this.id = output.id;
    this.name = output.name;
    this.created_at = output.created_at;
  }
}

export class VideoGenrePresenter {
  id: string;
  name: string;
  is_active: boolean;
  categories_id: string[];
  @Type(() => VideoCategoryPresenter)
  categories: VideoCategoryPresenter[];
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: VideoGenreOutput) {
    this.id = output.id;
    this.name = output.name;
    this.is_active = output.is_active;
    this.categories_id = output.categories_id;
    this.categories = output.categories.map(
      (item) => new VideoCategoryPresenter(item),
    );
    this.created_at = output.created_at;
  }
}

export class VideoCastMemberPresenter {
  id: string;
  name: string;
  type: CastMemberTypes;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: VideoCastMemberOutput) {
    this.id = output.id;
    this.name = output.name;
    this.type = output.type;
    this.created_at = output.created_at;
  }
}

export class VideoPresenter {
  id: string;
  title: string;
  description: string;
  year_launched: number;
  duration: number;
  rating: RatingValues;
  is_opened: boolean;
  is_published: boolean;
  categories_id: string[];
  @Type(() => VideoCategoryPresenter)
  categories: VideoCategoryPresenter[];
  genres_id: string[];
  @Type(() => VideoGenrePresenter)
  genres: VideoGenrePresenter[];
  cast_members_id: string[];
  @Type(() => VideoCastMemberPresenter)
  cast_members: VideoCastMemberPresenter[];
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: VideoOutput) {
    this.id = output.id;
    this.title = output.title;
    this.description = output.description;
    this.year_launched = output.year_launched;
    this.duration = output.duration;
    this.rating = output.rating;
    this.is_opened = output.is_opened;
    this.is_published = output.is_published;
    this.categories_id = output.categories_id;
    this.categories = output.categories.map(
      (item) => new VideoCategoryPresenter(item),
    );
    this.genres_id = output.genres_id;
    this.genres = output.genres.map((item) => new VideoGenrePresenter(item));
    this.cast_members_id = output.cast_members_id;
    this.cast_members = output.cast_members.map(
      (item) => new VideoCastMemberPresenter(item),
    );
    this.created_at = output.created_at;
  }
}

export class VideoCollectionPresenter extends CollectionPresenter {
  @Type(() => VideoPresenter)
  data: VideoPresenter[];

  constructor(output: ListVideosOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new VideoPresenter(item));
  }
}
