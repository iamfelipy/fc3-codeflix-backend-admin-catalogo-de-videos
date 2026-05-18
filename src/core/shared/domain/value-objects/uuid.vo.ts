import { ValueObject } from "../value-object";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

export class Uuid extends ValueObject {
  readonly id: string;
  
  // Chamar super(); é necessário porque Uuid estende ValueObject. No TypeScript, ao estender uma classe e definir um construtor, você precisa chamar super() para inicializar a classe pai. Mesmo que ValueObject não tenha um construtor personalizado, a chamada é obrigatória.
  constructor(id?: string) {
    super();
    this.id = id || uuidv4();
    this.validate();
  }

  private validate() {
    const isValid = uuidValidate(this.id);
    if (!isValid) {
      throw new InvalidUuidError();
    }
  }

  toString() {
    return this.id;
  }
}

export class InvalidUuidError extends Error {
  constructor(message?: string) {
    super(message || "ID must be a valida UUID");
    // A propriedade name define o nome do erro, útil para identificar o tipo de erro ao capturá-lo com catch, diferenciando de outros erros. No caso, será "InvalidUuidError".
    // Sim, name é uma propriedade padrão da classe Error em JavaScript/TypeScript, usada para identificar o tipo de erro lançado.
    // convenção
    // Se você não definir this.name, o nome será "Error", pois é o valor padrão da propriedade name na classe base Error do JavaScript.
    this.name = "InvalidUuidError";
  }
}