import { Sequelize } from "sequelize-typescript";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { CategoryModel } from "../category.model";
import { CategoryModelMapper } from "../category-model-mapper";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe("CategoryModelMapper Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });

  it("should throws error when category is invalid", () => {
    const model = CategoryModel.build({
      category_id: "9366b7dc-2d71-4799-b91c-c64adb205104",
    });
    try {
      CategoryModelMapper.toEntity(model);
      // se a fonte de verdade(banco de dados), trouxer dados com falha de integridade toEntity faz essa verificação
      // Jest implementa o fail globalmente por compatibilidade com Jasmine.
      // O fail é usado aqui para garantir que, caso o erro não seja lançado como esperado, o teste falhe explicitamente. Sem ele, se CategoryModelMapper.toEntity(model) não lançar erro, o teste apenas continuaria — e poderia passar sem detectar o problema. Assim, o fail torna o teste mais seguro, falhando propositalmente se o fluxo não entrar no bloco catch.
      fail(
        "The category is valid, but it needs throws a EntityValidationError"
      );
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect((e as EntityValidationError).error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should convert a category model to a category aggregate", () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      category_id: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });
    const aggregate = CategoryModelMapper.toEntity(model);
    expect(aggregate.toJSON()).toStrictEqual(
      new Category({
        category_id: new Uuid("5490020a-e866-4229-9adc-aa44b83234c4"),
        name: "some value",
        description: "some description",
        is_active: true,
        created_at,
      }).toJSON()
    );
  });

  test("should convert a category aggregate to a category model", () => {
    const created_at = new Date();
    const aggregate = new Category({
      category_id: new Uuid("5490020a-e866-4229-9adc-aa44b83234c4"),
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });
    const model = CategoryModelMapper.toModel(aggregate);
    expect(model.toJSON()).toStrictEqual({
      category_id: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });
  });
});