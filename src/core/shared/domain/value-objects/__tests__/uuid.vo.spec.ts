import { InvalidUuidError, Uuid } from "../uuid.vo";
import { validate as uuidValidate } from "uuid";
describe("Uuid Unit Tests", () => {
  /*
    // parada da convencao error e isso, anotar notion
    prototype em JavaScript é um objeto associado a funções construtoras e classes. Ele define propriedades e métodos que serão compartilhados por todas as instâncias criadas por aquele construtor. Ou seja, métodos definidos no prototype não são copiados para cada instância; todas apontam para o mesmo método, economizando memória e permitindo comportamento comum.

    Principais ideias:

    Todos os objetos têm uma cadeia de protótipos (prototype chain) para herdar métodos.
    Permite compartilhar métodos/atributos entre instâncias.
    Pode ser modificado para alterar/complementar o comportamento de objetos existentes.
    No seu teste, usar Uuid.prototype permite acessar (ou espionar) o método validate diretamente, sem depender de instâncias específicas.
  */
  const validateSpy = jest.spyOn(Uuid.prototype as any, "validate");

  test("should throw error when uuid is invalid", () => {
    expect(() => {
      new Uuid("invalid-uuid");
    }).toThrowError(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should create a valid uuid", () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(uuidValidate(uuid.id)).toBe(true);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should accept a valid uuid", () => {
    const uuid = new Uuid("c3e9b0d0-7b6f-4a8e-8e1f-3f9e6a2f7e3c");
    expect(uuid.id).toBe("c3e9b0d0-7b6f-4a8e-8e1f-3f9e6a2f7e3c");
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});