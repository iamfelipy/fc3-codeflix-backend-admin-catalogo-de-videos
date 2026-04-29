import { Entity } from "../entity";
import { ValueObject } from "../value-object";

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  insert(entity: E): Promise<void>;
  bulkInsert(entities: E[]): Promise<void>;
  update(entity: E): Promise<void>;
  delete(entity_id: E): Promise<void>;

  findById(entity_id: EntityId): Promise<E>;
  findAll(): Promise<E[]>;

  /*
    O tipo new (...args: any[]) => E descreve um construtor de classe em TypeScript: é uma função que pode ser chamada com new e aceita quaisquer argumentos (...args), retornando uma instância de E. Assim, getEntity() retorna o construtor da entidade, não a instância.
    significa que pode ser qualquer classe cujo construtor retorna um E, aceitando qualquer quantidade e tipo de argumentos.
  */
  getEntity(): new (...args: any[]) => E;
}