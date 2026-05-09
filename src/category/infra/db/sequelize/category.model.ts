import {
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table,
  } from "sequelize-typescript";
  
  // Active Record é um padrão de projeto onde cada objeto de uma classe representa uma linha de uma tabela do banco de dados; os próprios objetos contêm métodos para salvar, atualizar, excluir e buscar dados, centralizando lógica de persistência na própria entidade. O Sequelize Model segue esse padrão.
  @Table({ tableName: "categories", timestamps: false })
  export class CategoryModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare category_id: string;
  
    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name: string;
  
    @Column({ allowNull: true, type: DataType.TEXT })
    declare description: string | null;
  
    // declare informa ao TypeScript que a variável existe, mas não gera código JavaScript; é usada para tipar propriedades que serão gerenciadas por frameworks (como Sequelize), sem inicializá-las no código.
    @Column({ allowNull: false, type: DataType.BOOLEAN })
    declare is_active: boolean;
  
    //O 3 em DataType.DATE(3) especifica a precisão dos milissegundos no campo de data, permitindo até 3 casas decimais (milissegundos) na parte de segundos.
    @Column({ allowNull: false, type: DataType.DATE(3) })
    declare created_at: Date;
  }