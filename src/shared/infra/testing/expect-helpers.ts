import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { EntityValidationError } from "../../domain/validators/validation.error";
import { FieldsErrors } from "../../domain/validators/validator-fields-interface";

type Expected =
  | {
      validator: ClassValidatorFields<any>;
      data: any;
    }
  | (() => any);

// O expect é uma função global fornecida pelo Jest, disponível automaticamente nos arquivos de teste e em scripts de configuração/extensão (como este), permitindo a criação e extensão de matchers personalizados, como expect.extend().
expect.extend({
  containsErrorMessages(expected: Expected, received: FieldsErrors) {
    if (typeof expected === "function") {
      try {
        expected();
        return isValid();
      } catch (e) {
        const error = e as EntityValidationError;
        return assertContainsErrorsMessages(error.error, received);
      }
    } else {
      const { validator, data } = expected;
      const validated = validator.validate(data);

      if (validated) {
        return isValid();
      }

      return assertContainsErrorsMessages(validator.errors, received);
    }
  },
});

function assertContainsErrorsMessages(
  expected: FieldsErrors,
  received: FieldsErrors
) {
  /*
    # diferença entre expect utilitario e dentro do it
    e- aqui expect.objectContaining(...).asymmetricMatch(...) é usado como utilitário interno para checar objetos parcialmente, não faz um "teste" com relatório ou falha como dentro de um it(). 
    Dentro de um it(), expect(...).toBe(...) registra resultados dos testes; já asymmetricMatch apenas retorna true/false como uma função comum.
    
    # o que é asymmetric
    "Asymmetric" significa que a comparação é feita em apenas um sentido: verifica se um objeto contém as propriedades esperadas, sem exigir igualdade total.

    # como funciona asymmetricMatch
    expected deve conter pelo menos todas as propriedades e valores que existem em received. Ou seja, received é o “molde” e expected deve ter igual ou mais campos, mas os campos de received precisam estar presentes e iguais em expected.
  */
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected);

  return isMatch
    ? isValid()
    : {
        pass: false,
        message: () =>
          `The validation errors not contains ${JSON.stringify(
            received
          )}. Current: ${JSON.stringify(expected)}`,
      };
}

function isValid() {
  return { pass: true, message: () => "" };
}