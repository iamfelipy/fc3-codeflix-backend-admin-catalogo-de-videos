import { RabbitMQMessageBroker } from '../rabbitmq-message-broker';
import { Uuid } from '../../../domain/value-objects/uuid.vo';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Config } from '../../config';
import { ConsumeMessage } from 'amqplib';
import { IIntegrationEvent } from '@core/shared/domain/events/domain-event.interface';

class TestEvent implements IIntegrationEvent {
  occurred_on: Date = new Date();
  event_version: number = 1;
  event_name: string = TestEvent.name;
  constructor(readonly payload: any) {}
}

describe('RabbitMQMessageBroker Integration tests', () => {
  let service: RabbitMQMessageBroker;
  let connection: AmqpConnection;
  beforeEach(async () => {
    // nao conecta sozinho
    connection = new AmqpConnection({
      uri: Config.rabbitmqUri(),
      // configura como o .init() se comporta
      // O init() só resolve quando a conexão estiver pronta
      // Com wait: false, o init() retorna na hora e a conexão acontece em background (mais útil em app Nest que não deve crashar se o broker estiver offline).
      // Na prática, { wait: true } é redundante — já é o default.
      connectionInitOptions: { wait: true },
      logger: {
        debug: () => {},
        error: () => {},
        info: () => {},
        warn: () => {},
        log: () => {},
      } as any,
    });

    //  tenta conectar e BLOQUEIA até conectar (ou até 5s)
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
        event_name: TestEvent.name,
        event_version: 1,
        occurred_on: event.occurred_on.toISOString(),
        payload: event.payload,
      });
    });
  });
});