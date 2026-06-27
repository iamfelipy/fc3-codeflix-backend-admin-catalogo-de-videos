import { CategoryId } from '../../category/domain/category.aggregate';
import { AggregateRoot } from '../../shared/domain/aggregate-root';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { GenreFakeBuilder } from './genre-fake.builder';
import GenreValidatorFactory from './genre.validator';

export type GenreConstructorProps = {
  genre_id?: GenreId;
  name: string;
  categories_id: Map<string, CategoryId>;
  is_active?: boolean;
  created_at?: Date;
};
// O termo "command" vem do padrão Command do DDD/CQRS, usado para representar um comando de criação ou atualização contendo dados necessários para executar uma ação (neste caso, criar um gênero). Não precisa ser uma classe específica — pode ser apenas um tipo/DTO — mas a convenção é nomear os objetos de input desse jeito para distinguir de entidades e value objects.
// Comando: uma instrução enviada para um sistema executar uma ação.
export type GenreCreateCommand = {
  name: string;
  categories_id: CategoryId[];
  is_active?: boolean;
};

export class GenreId extends Uuid {}

export class Genre extends AggregateRoot {
  genre_id: GenreId;
  name: string;
  categories_id: Map<string, CategoryId>;
  is_active: boolean;
  created_at: Date;

  constructor(props: GenreConstructorProps) {
    super();
    this.genre_id = props.genre_id ?? new GenreId();
    this.name = props.name;
    this.categories_id = props.categories_id;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  static create(props: GenreCreateCommand) {
    const genre = new Genre({
      ...props,
      categories_id: new Map(
        props.categories_id.map((category_id) => [category_id.id, category_id]),
      ),
    });
    genre.validate();
    return genre;
  }

  changeName(name: string) {
    this.name = name;
    this.validate(['name']);
  }

  addCategoryId(category_id: CategoryId) {
    this.categories_id.set(category_id.id, category_id);
  }

  removeCategoryId(category_id: CategoryId) {
    this.categories_id.delete(category_id.id);
  }

  syncCategoriesId(categories_id: CategoryId[]) {
    if (categories_id.length) {
      throw new Error('Categories id is empty');
    }

    this.categories_id = new Map(
      categories_id.map((category_id) => [category_id.id, category_id]),
    );
  }

  activate() {
    this.is_active = true;
  }

  deactivate() {
    this.is_active = false;
  }

  get entity_id() {
    return this.genre_id;
  }

  validate(fields?: string[]) {
    const validator = GenreValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return GenreFakeBuilder;
  }

  toJSON() {
    return {
      genre_id: this.genre_id.id,
      name: this.name,
      // this.categories_id.values() retorna um iterador, não um array. É por isso que usamos Array.from() para convertê-lo em um array antes de mapear.
      categories_id: Array.from(this.categories_id.values()).map(
        (category_id) => category_id.id,
      ),
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}