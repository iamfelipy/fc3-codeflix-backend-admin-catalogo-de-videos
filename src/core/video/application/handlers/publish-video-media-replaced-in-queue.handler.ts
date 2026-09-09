import { IIntegrationEventHandler } from '@core/shared/application/domain-event-handler.interface';
import { VideoAudioMediaUploadedIntegrationEvent } from '@core/video/domain/domain-events/video-audio-media-replaced.event';
import { OnEvent } from '@nestjs/event-emitter';
import { IMessageBroker } from '../../../shared/application/message-broker.interface';

export class PublishVideoMediaReplacedInQueueHandler
  implements IIntegrationEventHandler
{
  constructor(private messageBroker: IMessageBroker) {
    console.log(messageBroker);
  }
  
  @OnEvent(VideoAudioMediaUploadedIntegrationEvent.name)
  async handle(event: VideoAudioMediaUploadedIntegrationEvent): Promise<void> {
    await this.messageBroker.publishEvent(event);
  }
}
