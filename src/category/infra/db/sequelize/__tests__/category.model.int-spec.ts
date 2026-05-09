import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { Category } from "../../../../domain/category.entity";

describe("CategoryModel Integration Tests", () => {
  test("should create a category", async () => {
    // Sim, o teste vai passar automaticamente se não tiver nenhum expect e nenhuma exceção for lançada. O Jest considera o teste como aprovado se não houver erro. Mas, sem expect, não há verificação de resultado ou comportamento.
    const sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [CategoryModel],
    });
    // recria o schema no banco novamente, force true destroi o que ja existe
    // util para testes
    await sequelize.sync({ force: true });

    const category = Category.fake().aCategory().build();

    await CategoryModel.create({
        category_id: category.category_id.id,
        name: category.name,
        description: category.description,
        is_active: category.is_active,
        created_at: category.created_at,
    });
  });
});