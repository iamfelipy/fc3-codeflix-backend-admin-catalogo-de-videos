import { validateSync } from 'class-validator';
import { IValidatorFields } from './validator-fields-interface';
import { Notification } from './notification';

export abstract class ClassValidatorFields implements IValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    const errors = validateSync(data, {
      groups: fields,
    });
    /*
      conteudo do erros
      saida do class-validator
      [
        {
          target: { name: "" },
          value: "",
          property: "name",
          children: [],
          constraints: {
            isNotEmpty: "name should not be empty",
            maxLength: "name must be shorter than or equal to 255 characters"
          }
        }
      ]
    */
    if (errors.length) {
      for (const error of errors) {
        const field = error.property;
        Object.values(error.constraints!).forEach((message) => {
          // field: name
          // message: "name should not be empty"
          notification.addError(message, field);
        });
      }
    }
    return !errors.length;
  }
}

