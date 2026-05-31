import { Entity } from '../entity';

export class NotFoundError extends Error {
  constructor(
    id: any[] | any,
    // essa tipagem aceita qualquer subclasse de Entity, pois permite construtores que retornam uma instância de Entity ou derivadas.
    // entityClass é uma classe (construtor), não uma instância.
    entityClass: new (...args: any[]) => Entity,
  ) {
    const idsMessage = Array.isArray(id) ? id.join(', ') : id;
    // toda classe constructora tem o .name nela
    super(`${entityClass.name} Not Found using ID ${idsMessage}`);
    this.name = 'NotFoundError';
  }
}