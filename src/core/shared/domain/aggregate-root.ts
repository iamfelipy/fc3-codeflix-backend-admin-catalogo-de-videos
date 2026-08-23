import EventEmitter2 from 'eventemitter2';
import { Entity } from './entity';
import { IDomainEvent } from './events/domain-event.interface';

// Mediator é um padrão de design que facilita a comunicação entre objetos, centralizando a troca de mensagens, evitando acoplamento direto. No código, localMediator permite que eventos sejam propagados e manipulados dentro do próprio aggregate sem que as classes conheçam umas às outras.

export abstract class AggregateRoot extends Entity {
  events: Set<IDomainEvent> = new Set<IDomainEvent>();
  localMediator = new EventEmitter2();

  //vai disparar somente o evento dentro do próprio aggregate
  applyEvent(event: IDomainEvent) {
    this.events.add(event);
    this.localMediator.emit(event.constructor.name, event);
  }

  registerHandler(event: string, handler: (event: IDomainEvent) => void) {
    this.localMediator.on(event, handler);
  }
}