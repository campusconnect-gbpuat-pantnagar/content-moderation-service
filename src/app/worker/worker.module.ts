import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from '../../libraries/queues/queue.module';
import { ConfigModule } from '@nestjs/config';
import { EmailQueues } from '../../libraries/queues/queue.constants';
import { ContentModerationProcessors } from './processors/content-moderation.processor';
import Post from 'src/libraries/dal/models/posts/post.schema';
import { PostService } from './services/post.service';
import { TextSentimentAnalysisService } from './services/text-sentiment-analysis.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
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
        backoff: {
          // Optional backoff settings for retrying failed jobs
          type: 'exponential',
          delay: 60000, // Initial delay of 60 second
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
    TextSentimentAnalysisService,
  ],
})
export class WorkerModule {}
