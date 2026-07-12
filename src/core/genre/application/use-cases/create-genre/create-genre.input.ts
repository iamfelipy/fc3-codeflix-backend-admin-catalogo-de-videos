import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsUUID,
  validateSync,
} from 'class-validator';

export type CreateGenreInputConstructorProps = {
  name: string;
  categories_id: string[];
  is_active?: boolean;
};

export class CreateGenreInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  // O 4 indica que o UUID deve ser do tipo 4 (UUID versão 4, gerado aleatoriamente). Isso garante que apenas valores nesse formato sejam considerados válidos pela validação.
  @IsUUID('4', { each: true })
  @IsArray()
  @IsNotEmpty()
  categories_id: string[];

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  constructor(props?: CreateGenreInputConstructorProps) {
    if (!props) return;
    this.name = props.name;
    this.categories_id = props.categories_id;
    this.is_active = props.is_active ?? true;
  }
}

export class ValidateCreateGenreInput {
  static validate(input: CreateGenreInput) {
    return validateSync(input);
  }
}
