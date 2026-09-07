import { IIntegrationEventHandler } from '@core/shared/application/domain-event-handler.interface';
import { VideoAudioMediaUploadedIntegrationEvent } from '@core/video/domain/domain-events/video-audio-media-replaced.event';
import { OnEvent } from '@nestjs/event-emitter';

export class PublishVideoMediaReplacedInQueueHandler
  implements IIntegrationEventHandler
{
  @OnEvent(VideoAudioMediaUploadedIntegrationEvent.name)
  async handle(event: VideoAudioMediaUploadedIntegrationEvent): Promise<void> {
    console.log(event);
  }
}
