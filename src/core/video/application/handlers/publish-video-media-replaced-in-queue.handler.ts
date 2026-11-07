import { IIntegrationEventHandler } from '@core/shared/application/domain-event-handler.interface';
import { VideoAudioMediaUploadedIntegrationEvent } from '@core/video/domain/domain-events/video-audio-media-replaced.event';
import { OnEvent } from '@nestjs/event-emitter';
import { IMessageBroker } from '../../../shared/application/message-broker.interface';

export class PublishVideoMediaReplacedInQueueHandler
  implements IIntegrationEventHandler
{
  constructor(private messageBroker: IMessageBroker) {
    //console.log(messageBroker);
  }
  /*
  @OnEvent(...) não coloca a função dentro do EventEmitter2 diretamente. O decorator marca o método com o nome do evento. Na inicialização, o Nest encontra essa marcação e registra o método como listener no EventEmitter2. Documentação do NestJS

  A ideia equivale a:

  eventEmitter.on(
    VideoAudioMediaUploadedIntegrationEvent.name,
    (event) => handler.handle(event),
  );

  Quando o evento é emitido, handle roda e publica a mensagem no RabbitMQ. Esse evento local do EventEmitter2 é o que aciona a publicação; ele próprio não é o evento trafegando pelo RabbitMQ.
  */
  @OnEvent(VideoAudioMediaUploadedIntegrationEvent.name)
  async handle(event: VideoAudioMediaUploadedIntegrationEvent): Promise<void> {
    await this.messageBroker.publishEvent(event);
  }
}
