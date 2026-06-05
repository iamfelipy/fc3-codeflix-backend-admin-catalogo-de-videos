import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { Category, CategoryId } from '../../../../domain/category.aggregate';
import { CategoryModelMapper } from '../category-model-mapper';
import { CategoryModel } from '../category.model';

describe('CategoryModelMapper Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  it('should throws error when category is invalid', () => {
    // fail não tem no jest, so a tipagem do jasmine
    // solução temporaria
    function fail(message: string): never {
      throw new Error(message);
    }
    expect.assertions(2);
    const model = CategoryModel.build({
      category_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'a'.repeat(256),
    });
    try {
      // se a fonte de verdade(banco de dados), trouxer dados com falha de integridade toEntity faz essa verificação
      // O fail é usado aqui para garantir que, caso o erro não seja lançado como esperado, o teste falhe explicitamente. Sem ele, se CategoryModelMapper.toEntity(model) não lançar erro, o teste apenas continuaria — e poderia passar sem detectar o problema. Assim, o fail torna o teste mais seguro, falhando propositalmente se o fluxo não entrar no bloco catch.
      CategoryModelMapper.toEntity(model);
      fail('The category is valid, but it needs throws a EntityValidationError');
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect((e as EntityValidationError).error).toMatchObject([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    }
  });

  it('should convert a category model to a category aggregate', () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      category_id: '5490020a-e866-4229-9adc-aa44b83234c4',
      name: 'some value',
      description: 'some description',
      is_active: true,
      created_at,
    });
    const aggregate = CategoryModelMapper.toEntity(model);
    expect(aggregate.toJSON()).toStrictEqual(
      new Category({
        category_id: new CategoryId('5490020a-e866-4229-9adc-aa44b83234c4'),
        name: 'some value',
        description: 'some description',
        is_active: true,
        created_at,
      }).toJSON(),
    );
  });
});