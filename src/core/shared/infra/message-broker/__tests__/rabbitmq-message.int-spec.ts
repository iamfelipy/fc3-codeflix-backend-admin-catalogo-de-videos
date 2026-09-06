import { RabbitMQMessageBroker } from '../rabbitmq-message-broker';
import { IDomainEvent } from '../../../domain/events/domain-event.interface';
import { Uuid } from '../../../domain/value-objects/uuid.vo';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Config } from '../../config';
import { ConsumeMessage } from 'amqplib';

class TestEvent implements IDomainEvent {
  occurred_on: Date = new Date();
  event_version: number = 1;
  constructor(readonly aggregate_id: Uuid) {}
}

describe('RabbitMQMessageBroker Integration tests', () => {
  let service: RabbitMQMessageBroker;
  let connection: AmqpConnection;
  beforeEach(async () => {
    connection = new AmqpConnection({
      uri: Config.rabbitmqUri(),
      connectionInitOptions: { wait: true },
      logger: {
        debug: () => {},
        error: () => {},
        info: () => {},
        warn: () => {},
        log: () => {},
      } as any,
    });

    await connection.init();
    const channel = connection.channel;

    // Declara (cria) a exchange chamada 'test-exchange' do tipo 'direct', não durável
    //  Se durable: true, ela permanece existente após reinicializações.
    await channel.assertExchange('test-exchange', 'direct', {
      durable: false,
    });
    // Declara (cria) a fila chamada 'test-queue', não durável
    await channel.assertQueue('test-queue', { durable: false });
    // Limpa todas as mensagens da fila 'test-queue'
    await channel.purgeQueue('test-queue');
    // Faz o bind da fila 'test-queue' à exchange 'test-exchange' usando o routing key 'TestEvent'
    await channel.bindQueue('test-queue', 'test-exchange', 'TestEvent');
    service = new RabbitMQMessageBroker(connection);
  });

  afterEach(async () => {
    try {
      await connection.managedConnection.close();
    } catch (err) {}
  });

  describe('publish', () => {
    it('should publish events to channel', async () => {
      const event = new TestEvent(new Uuid());

      await service.publishEvent(event);
      const msg: ConsumeMessage = await new Promise((resolve) => {
        connection.channel.consume('test-queue', (msg) => {
          resolve(msg);
        });
      });
      const msgObj = JSON.parse(msg.content.toString());
      expect(msgObj).toEqual({
        aggregate_id: { id: event.aggregate_id.id },
        event_version: 1,
        occurred_on: event.occurred_on.toISOString(),
      });
    });
  });
});
