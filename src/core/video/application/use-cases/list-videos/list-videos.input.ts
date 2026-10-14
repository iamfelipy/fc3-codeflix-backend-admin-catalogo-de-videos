import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID, ValidateNested, validateSync } from 'class-validator';
import { SearchInput } from '../../../../shared/application/search-input';
import { SortDirection } from '../../../../shared/domain/repository/search-params';

export class ListVideosFilter {
  @IsString()
  @IsOptional()
  title?: string;

  @IsUUID('4', { each: true })
  @IsArray()
  @IsOptional()
  categories_id?: string[];

  @IsUUID('4', { each: true })
  @IsArray()
  @IsOptional()
  genres_id?: string[];

  @IsUUID('4', { each: true })
  @IsArray()
  @IsOptional()
  cast_members_id?: string[];
}

export class ListVideosInput implements SearchInput<ListVideosFilter> {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;

  @ValidateNested()
  @Type(() => ListVideosFilter)
  @IsOptional()
  filter?: ListVideosFilter;
}

export class ValidateListVideosInput {
  static validate(input: ListVideosInput) {
    return validateSync(input);
  }
}
