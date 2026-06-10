import {
  Column,
  DataType,
  PrimaryKey,
  Table,
  Model,
} from 'sequelize-typescript';

import { literal, Op } from 'sequelize';
import {
  CastMember,
  CastMemberId,
} from '../../../domain/cast-member.aggregate';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { LoadEntityError } from '../../../../shared/domain/validators/validation.error';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import {
  ICastMemberRepository,
  CastMemberSearchParams,
  CastMemberSearchResult,
} from '../../../domain/cast-member.repository';
import {
  CastMemberType,
  CastMemberTypes,
} from '../../../domain/cast-member-type.vo';
import { InvalidArgumentError } from '../../../../shared/domain/errors/invalid-argument.error';

export type CastMemberModelProps = {
  cast_member_id: string;
  name: string;
  type: CastMemberTypes;
  created_at: Date;
};

@Table({ tableName: 'cast_members', timestamps: false })
export class CastMemberModel extends Model<CastMemberModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  // declare é utilizado no TypeScript para informar ao compilador que as propriedades existem em tempo de execução, mas não serão inicializadas no construtor da classe. Isso é útil em modelos do Sequelize porque o ORM vai definir esses valores automaticamente. Isso evita erros de "propriedade não inicializada" no TypeScript.
  declare cast_member_id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.SMALLINT,
  })
  declare type: CastMemberTypes;

  @Column({ allowNull: false, type: DataType.DATE(3) })
  declare created_at: Date;
}

export class CastMemberSequelizeRepository implements ICastMemberRepository {
  sortableFields: string[] = ['name', 'created_at'];
  orderBy = {
    mysql: {
      // precisa disso pois a collaction nao esta configurada para ascii ordenação
      name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`),
    },
  };
  constructor(private castMemberModel: typeof CastMemberModel) {}

  async insert(entity: CastMember): Promise<void> {
    await this.castMemberModel.create(entity.toJSON());
  }

  async bulkInsert(entities: CastMember[]): Promise<void> {
    await this.castMemberModel.bulkCreate(entities.map((e) => e.toJSON()));
  }

  async findById(id: CastMemberId): Promise<CastMember | null> {
    const model = await this._get(id.id);
    return model ? CastMemberModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<CastMember[]> {
    const models = await this.castMemberModel.findAll();
    return models.map((m) => CastMemberModelMapper.toEntity(m));
  }

  async findByIds(ids: CastMemberId[]): Promise<CastMember[]> {
    const models = await this.castMemberModel.findAll({
      where: {
        cast_member_id: {
          [Op.in]: ids.map((id) => id.id),
        },
      },
    });
    return models.map((m) => CastMemberModelMapper.toEntity(m));
  }

  // No contexto do método existsById, "by" indica o critério utilizado na busca ou validação. Ou seja, verificar a existência "pelo id" ou "através do id". É um padrão de nomenclatura comum em métodos de repositórios para indicar o campo usado como filtro ou referência.
  async existsById(
    ids: CastMemberId[],
  ): Promise<{ exists: CastMemberId[]; not_exists: CastMemberId[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        'ids must be an array with at least one element',
      );
    }

    const existsCastMemberModels = await this.castMemberModel.findAll({
      // attributes serve para especificar quais colunas (fields) devem ser retornadas na query. 
      attributes: ['cast_member_id'],
      where: {
        cast_member_id: {
          [Op.in]: ids.map((id) => id.id),
        },
      },
    });
    const existsCastMemberIds = existsCastMemberModels.map(
      (m) => new CastMemberId(m.cast_member_id),
    );
    const notExistsCastMemberIds = ids.filter(
      (id) => !existsCastMemberIds.some((e) => e.equals(id)),
    );
    return {
      exists: existsCastMemberIds,
      not_exists: notExistsCastMemberIds,
    };
  }

  async update(entity: CastMember): Promise<void> {
    const id = entity.cast_member_id.id;

    const [affectedRows] = await this.castMemberModel.update(entity.toJSON(), {
      where: { cast_member_id: entity.cast_member_id.id },
    });

    if (affectedRows !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }
  async delete(cast_member_id: CastMemberId): Promise<void> {
    const id = cast_member_id.id;

    const affectedRows = await this.castMemberModel.destroy({
      where: { cast_member_id: id },
    });

    if (affectedRows !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  private async _get(id: string): Promise<CastMemberModel | null> {
    return this.castMemberModel.findByPk(id);
  }

  async search(props: CastMemberSearchParams): Promise<CastMemberSearchResult> {
    // paginação
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;

    // filtro
    const where = {};
    if (props.filter && (props.filter.name || props.filter.type)) {
      if (props.filter.name) {
        where['name'] = { [Op.like]: `%${props.filter.name}%` };
      }

      if (props.filter.type) {
        where['type'] = props.filter.type.type;
      }
    }

    const { rows: models, count } = await this.castMemberModel.findAndCountAll({
      // filter
      ...(props.filter && {
        where,
      }),
      // ordenação
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: this.formatSort(props.sort, props.sort_dir!) }
        : { order: [['created_at', 'DESC']] }),
      // paginaçaõ
      offset,
      limit,
    });
    return new CastMemberSearchResult({
      items: models.map((m) => CastMemberModelMapper.toEntity(m)),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  private formatSort(sort: string, sort_dir: SortDirection) {
    const dialect = this.castMemberModel.sequelize!.getDialect() as 'mysql';
    if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
      return this.orderBy[dialect][sort](sort_dir);
    }
    return [[sort, sort_dir]];
  }

  getEntity(): new (...args: any[]) => CastMember {
    return CastMember;
  }
}

export class CastMemberModelMapper {
  static toEntity(model: CastMemberModel) {
    const { cast_member_id: id, ...otherData } = model.toJSON();
    const [type, errorCastMemberType] = CastMemberType.create(
      otherData.type as any,
    ).asArray();

    const castMember = new CastMember({
      ...otherData,
      cast_member_id: new CastMemberId(id),
      type,
    });

    castMember.validate();

    const notification = castMember.notification;
    if (errorCastMemberType) {
      notification.setError(errorCastMemberType.message, 'type');
    }

    if (notification.hasErrors()) {
      throw new LoadEntityError(notification.toJSON());
    }

    return castMember;
  }
}
