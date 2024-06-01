import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from '../../libraries/queues/queue.module';
import { ConfigModule } from '@nestjs/config';
import { EmailQueues } from '../../libraries/queues/queue.constants';
import { ContentModerationProcessors } from './processors/content-moderation.processor';
import Post from 'src/libraries/dal/models/posts/post.schema';
import { PostService } from './services/post.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_CONTENT_MODERATION_NOTIFICATION_HOST,
        port: Number(process.env.REDIS_CONTENT_MODERATION_NOTIFICATION_PORT),
        username: process.env.REDIS_CONTENT_MODERATION_NOTIFICATION_USER,
        password: process.env.REDIS_CONTENT_MODERATION_NOTIFICATION_PASS,
      },
      defaultJobOptions: {
        removeOnComplete: true, // Remove job from the queue once it's completed
        attempts: 3, // Number of attempts before a job is marked as failed
        removeOnFail: {
          age: 200,
          count: 10,
        },
      },
    }),

    QueueModule.register({
      queues: [EmailQueues.CONTENT_MODERATION_QUEUE],
    }),
  ],
  controllers: [],
  providers: [
    ContentModerationProcessors,
    { provide: 'POST_MODEL', useValue: Post },
    PostService,
  ],
})
export class WorkerModule {}
