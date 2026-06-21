import { Transform } from 'class-transformer';
import { ListCastMembersOutput } from '../../core/cast-member/application/use-cases/list-cast-members/list-cast-members.use-case';
import { CastMemberTypes } from '../../core/cast-member/domain/cast-member-type.vo';
import { CollectionPresenter } from '../../nest-modules/shared-module/collection.presenter';
import { CastMemberOutput } from '../../core/cast-member/application/use-cases/common/cast-member-output';

export class CastMemberPresenter {
  id: string;
  name: string;
  type: CastMemberTypes;
  @Transform(({ value }: { value: Date }) => {
    return value.toISOString();
  })
  created_at: Date;

  constructor(output: CastMemberOutput) {
    this.id = output.id;
    this.name = output.name;
    this.type = output.type;
    this.created_at = output.created_at;
  }
}

// Coleção: Reunião de itens, geralmente organizada ou ordenada.
export class CastMemberCollectionPresenter extends CollectionPresenter {
  //  Como você cria instâncias de CastMemberPresenter no construtor, o transform de created_at será aplicado mesmo sem decorator em data
  //  o array já contém instâncias de CastMemberPresenter, então o transform de created_at será aplicado.
  data: CastMemberPresenter[];
  //sugestão de reuso
  // constructor(output: CastMemberOutput[], paginationProps){

  // }

  constructor(output: ListCastMembersOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new CastMemberPresenter(item));
  }
}
