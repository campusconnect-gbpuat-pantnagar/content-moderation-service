import { InjectQueue } from '@nestjs/bullmq';
import { EmailQueues } from '../queue.constants';

export const InjectAuthNotificationQueue = () =>
  InjectQueue(EmailQueues.APP_NOTIFICATION);

export const InjectContentModerationNotificationQueue = () =>
  InjectQueue(EmailQueues.CONTENT_MODERATION_NOTIFICATION_QUEUE);
