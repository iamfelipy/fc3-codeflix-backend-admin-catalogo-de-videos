import { instanceToPlain } from "class-transformer";
import { CategoryPresenter } from "../categories.presenter";

describe("Category Presenter Unit Tests", () => {
  describe('constructor', () => {
    it('should set values', () => {
      const presenter = new CategoryPresenter({
        id: 'XXX-XXX',
        name: 'roupa',
        description: 'roupas da loja',
        is_active: true,
        created_at: new Date()
      });

      expect(presenter.id).toBe('XXX-XXX');
      expect(presenter.name).toBe('melissa');
      expect(presenter.description).toBe('ana');
      expect(presenter.created_at).toBeInstanceOf(Date);
 
    });
  });

  it('should presenter data', () => {
    const presenter = new CategoryPresenter({
      id: 'XXX-XXX',
      name: 'roupa',
      description: 'roupas da loja',
      is_active: true,
      created_at: new Date()
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      id: 'XXX-XXX',
      name: 'roupa',
      description: 'roupas da loja',
      created_at: presenter.created_at.toISOString(),
    });
  });
})