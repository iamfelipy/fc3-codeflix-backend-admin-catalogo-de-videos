import { SearchResult } from "../domain/repository/search-result";

export type PaginationOutput<Item = any> = {
  items: Item[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
};

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    // ao usar Omit<SearchResult, "items">, ele garante que o método toOutput não permitirá acessar items via o parâmetro props. Isso força quem chama o método a fornecer os items separadamente, evitando confusões e possíveis inconsistências.
    props: Omit<SearchResult, "items">
  ): PaginationOutput<Item> {
    return {
      items,
      total: props.total,
      current_page: props.current_page,
      last_page: props.last_page,
      per_page: props.per_page,
    };
  }
}