import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQMessageBroker } from '../../core/shared/infra/message-broker/rabbitmq-message-broker';
import { RabbitmqConsumeErrorFilter } from './rabbitmq-consume-error/rabbitmq-consume-error.filter';

// @Module({
//   imports: [
//     RabbitMQModule.forRootAsync(RabbitMQModule, {
//       useFactory: (configService: ConfigService) => ({
//         uri: configService.get('RABBITMQ_URI') as string,
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   providers: [
//     {
//       provide: 'IMessageBroker',
//       useFactory: (amqpConnection: AmqpConnection) => {
//         return new RabbitMQMessageBroker(amqpConnection);
//       },
//       inject: [AmqpConnection],
//     },
//   ],
//   exports: ['IMessageBroker'],
// })
type RabbitMQModuleOptions = {
  enableConsumers?: boolean;
};
export class RabbitmqModule {
  static forRoot(options: RabbitMQModuleOptions = {}): DynamicModule {
    return {
      // O campo module é obrigatório em Dynamic Modules do NestJS. Ele indica qual é o próprio módulo sendo configurado e exportado, permitindo que o Nest interne relacione corretamente os provedores, imports e exports com essa classe de módulo específica.
      module: RabbitmqModule,
      imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
          useFactory: (configService: ConfigService) => ({
            uri: configService.get('RABBITMQ_URI') as string,
            registerHandlers:
              options.enableConsumers ||
              configService.get('RABBITMQ_REGISTER_HANDLERS'),
            exchanges: [
              {
                name: 'dlx.exchange',
                type: 'topic',
              },
              {
                name: 'direct.delayed',
                type: 'x-delayed-message',
                options: {
                  arguments: {
                    'x-delayed-type': 'direct',
                  },
                },
              },
            ],
            queues: [
              {
                name: 'dlx.queue',
                exchange: 'dlx.exchange',
                routingKey: '#', //aceito qualquer routing key
                createQueueIfNotExists: false,
              },
            ],
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [RabbitmqConsumeErrorFilter],
      global: true,
      //  AmqpConnection fica acessível aos demais módulos porque o RabbitmqModule global exporta o RabbitMQModule, que fornece essa conexão.
      // Pergunta: forFeature() conseguiria injetar AmqpConnection se RabbitmqModule não fosse global e não exportasse RabbitMQModule?
      // Resposta: Não. forFeature() precisa que AmqpConnection esteja disponível no contexto de injeção.
      // Você está exportando o módulo RabbitMQModule. Ele disponibiliza os providers que o próprio módulo exporta — não todos automaticamente. Para saber se AmqpConnection fica acessível, é preciso verificar se RabbitMQModule o exporta.
      exports: [RabbitMQModule],
    };
  }

  static forFeature(): DynamicModule {
    return {
      // Pergunta: Dois módulos dinâmicos com module: RabbitmqModule podem conflitar se forRoot() for global e forFeature() for local?
      // Resposta: Em geral, não. O Nest registra as configurações dinâmicas como módulos distintos. forFeature() ainda precisa acessar AmqpConnection, fornecido pelo forRoot().

      module: RabbitmqModule,
      providers: [
        {
          provide: 'IMessageBroker',
          useFactory: (amqpConnection: AmqpConnection) => {
            return new RabbitMQMessageBroker(amqpConnection);
          },
          inject: [AmqpConnection],
        },
      ],
      exports: ['IMessageBroker'],
    };
  }
}