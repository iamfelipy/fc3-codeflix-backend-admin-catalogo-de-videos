import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NotFoundError } from '../../../core/shared/domain/errors/not-found.error';
import { EntityValidationError } from '../../../core/shared/domain/validators/validation.error';
import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage, MessagePropertyHeaders } from 'amqplib';
@Catch()
export class RabbitmqConsumeErrorFilter implements ExceptionFilter {
  static readonly RETRY_COUNT_HEADER = 'x-retry-count';
  static readonly MAX_RETRIES = 3;

  static readonly NON_RETRIABLE_ERRORS = [
    NotFoundError,
    EntityValidationError,
    UnprocessableEntityException,
  ];

  constructor(private amqpConnection: AmqpConnection) {}

  async catch(exception: Error, host: ArgumentsHost) {
    console.log('RabbitMQConsumeErrorFilter - Exception: ', exception);
    if (host.getType<'rmq'>() !== 'rmq') {
      return;
    }

    const hasRetriableError =
      RabbitmqConsumeErrorFilter.NON_RETRIABLE_ERRORS.some(
        (error) => exception instanceof error,
      );

    if (hasRetriableError) {
      // Nack sinaliza ao RabbitMQ que a mensagem não foi processada com sucesso. Você pode configurar se ela deve voltar para a fila (requeue) ou ser descartada/encaminhada para uma dead-letter queue.
      return new Nack(false);
    }

    const ctx = host.switchToRpc();
    const message: ConsumeMessage = ctx.getContext();

    console.log('RabbitMQConsumeErrorFilter - Exception: ', exception);
    console.log(
      'RabbitMQConsumeErrorFilter - Retry Count',
      message.properties.headers[RabbitmqConsumeErrorFilter.RETRY_COUNT_HEADER],
    );

    if (this.shouldRetry(message.properties.headers)) {
      // Nesse fluxo, a mensagem atual é confirmada (ack) após retry() publicar a cópia na exchange direct.delayed. O await só espera a publicação.
      // A nova mensagem mantém o conteúdo e recebe o atraso de 5 segundos e o contador atualizado.
      await this.retry(message);
    } else {
      // /encaminha para a dead-letter queue
      return new Nack(false);
    }
  }

  private shouldRetry(messageHeaders: MessagePropertyHeaders): boolean {
    const retryHeader = RabbitmqConsumeErrorFilter.RETRY_COUNT_HEADER;
    const maxRetries = RabbitmqConsumeErrorFilter.MAX_RETRIES;
    return (
      !(retryHeader in messageHeaders) ||
      messageHeaders[retryHeader] < maxRetries
    );
  }

  private async retry(message: ConsumeMessage) {
    const messageHeaders = message.properties.headers;
    const retryHeader = RabbitmqConsumeErrorFilter.RETRY_COUNT_HEADER;
    messageHeaders[retryHeader] = messageHeaders[retryHeader]
      ? messageHeaders[retryHeader] + 1
      : 1;
    messageHeaders['x-delay'] = 5000; //5s
    return this.amqpConnection.publish(
      'direct.delayed',
      message.fields.routingKey,
      message.content,
      {
        correlationId: message.properties.correlationId,
        headers: messageHeaders,
      },
    );
  }
}

//http rabbitmq