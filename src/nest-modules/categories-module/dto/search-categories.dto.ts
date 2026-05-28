import { ListCategoriesInput } from '../../../core/category/application/use-cases/list-categories/list-categories.use-case';
import { SortDirection } from '../../../core/shared/domain/repository/search-params';

export class SearchCategoriesDto implements ListCategoriesInput {
  page?: number;
  per_page?: number;
  sort?: string;
  // O TypeScript aceita que o tipo de sort_dir em SearchCategoriesDto seja declarado como SortDirection, e o NestJS faz o binding automático dos parâmetros de query (strings da URL) para o DTO. Como SortDirection provavelmente é um enum ou union de strings, qualquer valor válido passado na query string (ex: asc ou desc) é aceito como SortDirection. Não há conversão explícita: o valor string já casa com o tipo do DTO.
  // esse sortdirection é um enum ou uniontype
  sort_dir?: SortDirection;
  filter?: string;
}