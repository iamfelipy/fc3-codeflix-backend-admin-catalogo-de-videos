import { Type } from 'class-transformer';
import { SearchInput } from '../../../../shared/application/search-input';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { CastMemberTypes } from '../../../domain/cast-member-type.vo';
import { IsInt, IsOptional, ValidateNested, validateSync } from 'class-validator';

export class ListCastMembersFilter {
  name?: string | null;
  @IsInt()
  @IsOptional()
  // isso é ativado pelo pipe global transform true, dto do controller é convertido de string para numero
  // a classe é extendida para o dto de controller
  @Type(() => Number)
  type?: CastMemberTypes | null;
}

export class ListCastMembersInput
  implements SearchInput<ListCastMembersFilter>
{
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  @ValidateNested()
  @Type(() => ListCastMembersFilter)
  filter?: ListCastMembersFilter;
}

export class ValidateListCastMembersInput {
  static validate(input: ListCastMembersInput) {
    return validateSync(input);
  }
}
