import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { EmailQueues } from 'src/libraries/queues/queue.constants';
import { Job } from 'bullmq';
import {
  PostCreatedJOb,
  QueueEventJobPattern,
} from 'src/libraries/queues/jobs';

import { ConfigService } from '@nestjs/config';
import { PostService } from '../services/post.service';
import mongoose from 'mongoose';
@Processor(EmailQueues.CONTENT_MODERATION_QUEUE, {
  concurrency: 100,
  useWorkerThreads: true,
})
@Injectable()
export class ContentModerationProcessors extends WorkerHost {
  private readonly logger = new Logger(ContentModerationProcessors.name);
  constructor(
    private _configService: ConfigService,
    private _postService: PostService,
  ) {
    super();
  }
  async process(
    job: Job<PostCreatedJOb['data'], number, string>,
  ): Promise<void> {
    try {
      switch (job.name) {
        case QueueEventJobPattern.POST_CREATED:
          await this.checkPostContent(job);
          break;
        default:
          break;
      }
    } catch (error) {
      this.logger.error(
        `Failed to process job ${job.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async checkPostContent(job: Job<PostCreatedJOb['data']>) {
    const { postId } = job.data;
    console.log(postId);
    const post = await this._postService.getPostById(
      new mongoose.Types.ObjectId(postId),
    );
    console.log(post);
    // TODO: FETCHED THE POST BASED ON POSTID FROM MONGODB
    // TODO: SEND THE CONTENT IN THE SENTIMENT ANALYSIS MODEL
    // TODO: CHECK IS THE CONTENT IS SAFE (i.e) the negative level should not be the greater than 0.6
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<PostCreatedJOb['data']>) {
    const { id, name, queueName, finishedOn } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';

    this.logger.log(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}.`,
    );
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    const { id, name, progress } = job;
    this.logger.log(`Job id: ${id}, name: ${name} completes ${progress}%`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    const { id, name, queueName, timestamp } = job;
    const startTime = timestamp ? new Date(timestamp).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} starts in queue ${queueName} on ${startTime}.`,
    );
  }
}
