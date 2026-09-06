import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqFakeController } from './rabbitmq-fake.controller';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

describe('RabbitmqFakeController', () => {
  let controller: RabbitmqFakeController;
  let amqpConnectionMock: { publish: jest.Mock };

  beforeEach(async () => {
    amqpConnectionMock = {
      publish: jest.fn(),
    };

    const module = await (
      await import('@nestjs/testing')
    ).Test.createTestingModule({
      controllers: [RabbitmqFakeController],
      providers: [
        {
          provide: AmqpConnection,
          useValue: amqpConnectionMock,
        },
      ],
    }).compile();

    controller = module.get<RabbitmqFakeController>(RabbitmqFakeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call publish on amqpConnection', async () => {
    await controller.publishMessage();
    expect(amqpConnectionMock.publish).toHaveBeenCalledWith(
      'amq.direct',
      'fake-key',
      { message: 'Hello World' }
    );
  });
});