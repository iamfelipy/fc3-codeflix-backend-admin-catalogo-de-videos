import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from "class-validator";

export type CreateCategoryInputConstructorProps = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export class CreateCategoryInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  constructor(props: CreateCategoryInputConstructorProps) {
    // class-validator foi usado no dominio e no nest
    // esse if é pq o nestjs inializa a dependencia vazia, isso é por causa da injeção de dependencia
    if (!props) return;
    this.name = props.name;
    this.description = props.description;
    this.is_active = props.is_active;
  }
}

// esse método é para validação manual e normalmente não é usado pelo NestJS quando o ValidationPipe já está configurado.
export class ValidateCreateCategoryInput {
  static validate(input: CreateCategoryInput) {
    return validateSync(input);
  }
}