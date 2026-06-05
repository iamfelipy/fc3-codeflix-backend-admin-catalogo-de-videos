import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category, CategoryId } from "../../../domain/category.aggregate";
import { CategoryModel } from "./category.model";

export class CategoryModelMapper {
  /*
    Pergunta:
    Tem 3 formas de usar o model no sequelize, dê um exemplo de cada.

    Resposta:

    Active Record (Instância):
    const instance = CategoryModel.build({...}); await instance.save();

    Método Estático:
    await CategoryModel.create({...});

    Consulta de Dados:
    const result = await CategoryModel.findByPk(id);
  */
	static toModel(entity: Category): CategoryModel {
    return CategoryModel.build({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
  }

  static toEntity(model: CategoryModel): Category {
    const category = new Category({
      category_id: new CategoryId(model.category_id),
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      created_at: model.created_at,
    });
    
    category.validate();
    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }
    return category;
  }
}