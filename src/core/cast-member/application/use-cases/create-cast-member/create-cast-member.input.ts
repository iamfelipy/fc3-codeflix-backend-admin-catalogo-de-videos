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
