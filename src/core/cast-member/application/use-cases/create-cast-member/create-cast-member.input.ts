import { IsInt, IsNotEmpty, IsString, validateSync } from 'class-validator';
import { CastMemberTypes } from '../../../domain/cast-member-type.vo';

export type CreateCastMemberInputConstructorProps = {
  name: string;
  type: CastMemberTypes;
};

export class CreateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  type: CastMemberTypes;

  //Quando o Global Validation Pipe do NestJS recebe uma requisição, ele instancia o DTO sem argumentos para validar os dados recebidos. O !props return; evita que, nessa instanciação sem parâmetros, o acesso a props.name e props.type cause erro, garantindo que as propriedades sejam setadas só quando props existir. Isso permite que a validação funcione sem exceptions desnecessárias.
  // Sim, props?. resolve, pois props?.name e props?.type serão undefined se props for undefined, e não causará exceção. O efeito é equivalente ao if (!props) return;, mas as propriedades ficarão undefined, o que pode afetar validações caso esperem valores obrigatórios.
  constructor(props?: CreateCastMemberInputConstructorProps) {
    if (!props) return;
    this.name = props.name;
    this.type = props.type;
  }
}

export class ValidateCreateCastMemberInput {
  static validate(input: CreateCastMemberInput) {
    return validateSync(input);
    // exemplo explicito da saida
    /*
      [
        {
          "target": {
            "name": "",
            "type": "abc"
          },
          "value": "",
          "property": "name",
          "children": [],
          "constraints": {
            "isNotEmpty": "name should not be empty",
            "isString": "name must be a string"
          }
        },
        {
          "target": {
            "name": "",
            "type": "abc"
          },
          "value": "abc",
          "property": "type",
          "children": [],
          "constraints": {
            "isInt": "type must be an integer",
            "isNotEmpty": "type should not be empty"
          }
        }
      ]
    */
  }
}
