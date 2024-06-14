import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from '../../libraries/queues/queue.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailQueues } from '../../libraries/queues/queue.constants';
import { ContentModerationProcessors } from './processors/content-moderation.processor';
import { TextSentimentAnalysisService } from './services/text-sentiment-analysis.service';
import { HttpModule } from '@nestjs/axios';
import { MailerModule } from '@nestjs-modules/mailer';
import * as path from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { ContentModerationNotificationProcessor } from './processors/content-moderation-notification.processor';
import { TextCategorizer } from './services/text-categorizer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostModule,
    UserModule,
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_SERVICE_HOST'),
          // For SSL and TLS connection
          auth: {
            // Account gmail address
            user: configService.get('SMTP_SERVICE_EMAIL'),
            pass: configService.get('SMTP_SERVICE_PASSWORD'),
          },
        },
        template: {
          dir: path.resolve(__dirname, '../../../templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
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
      queues: [
        EmailQueues.CONTENT_MODERATION_QUEUE,
        EmailQueues.CONTENT_MODERATION_NOTIFICATION_QUEUE,
      ],
    }),
  ],
  controllers: [],
  providers: [
    ContentModerationProcessors,
    ContentModerationNotificationProcessor,
    TextSentimentAnalysisService,
    TextCategorizer,
    PostService,
    UserService,
  ],
})
export class WorkerModule {}
