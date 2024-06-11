import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  QueueEventJobPattern,
  UnsafePostAlertJob,
  UserAccountBlockAlertJob,
  UserBannedAdminNotificationJob,
} from 'src/libraries/queues/jobs';
import { Job } from 'bullmq';
import { EmailQueues } from 'src/libraries/queues/queue.constants';
import { MailerService } from '@nestjs-modules/mailer';

@Processor(EmailQueues.CONTENT_MODERATION_NOTIFICATION_QUEUE, {
  concurrency: 100,
  useWorkerThreads: true,
})
export class ContentModerationNotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(
    ContentModerationNotificationProcessor.name,
  );
  constructor(
    private _configService: ConfigService,
    private _mailService: MailerService,
  ) {
    super();
  }
  async process(
    job: Job<
      | UnsafePostAlertJob['data']
      | UserAccountBlockAlertJob['data']
      | UserBannedAdminNotificationJob['data'],
      number,
      string
    >,
  ): Promise<void> {
    try {
      switch (job.name) {
        case QueueEventJobPattern.CONTENT_MODERATION_NOTIFICATION_FOR_USER:
          await this.sendEmailRegardingContentPolicyViolations(
            job.data as UnsafePostAlertJob['data'],
          );
          break;
        case QueueEventJobPattern.CONTENT_MODERATION_NOTIFICATION_ACCOUNT_BLOCKED_FOR_USER:
          await this.sendEmailToNotifyUserAccountBanned(
            job.data as UserAccountBlockAlertJob['data'],
          );
          break;
        case QueueEventJobPattern.CONTENT_MODERATION_NOTIFICATION_ACCOUNT_BLOCKED_FOR_ADMIN:
          await this.sendEmailToAdminForUserBanned(
            job.data as UserBannedAdminNotificationJob['data'],
          );
          break;
        default:
          break;
      }
    } catch (error) {
      this.logger.error(
        `Failed to process job : ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async sendEmailRegardingContentPolicyViolations(
    data: UnsafePostAlertJob['data'],
  ) {
    const { email, username } = data;
    this.logger.debug('content policy violation by:', email);
    try {
      const context = {
        username,
        // content,
      };
      await this._mailService.sendMail({
        to: email,
        from: `CampusConnect ${this._configService.get<string>('SMTP_SERVICE_EMAIL')}`,
        subject: `Content Policy Violation ⚠️ Your Post Flagged and Blocked on CampusConnect`,
        template: 'content-policy-violation.ejs',
        context,
      });
      this.logger.debug(`Email send to ${email}`);
    } catch (error) {
      this.logger.error(
        `Error checking post content for job  ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
  async sendEmailToNotifyUserAccountBanned(
    data: UserAccountBlockAlertJob['data'],
  ) {
    const { email, username } = data;
    this.logger.debug('content policy violation by:', email);
    try {
      const context = {
        username,
        // content,
      };
      await this._mailService.sendMail({
        to: email,
        from: `CampusConnect ${this._configService.get<string>('SMTP_SERVICE_EMAIL')}`,
        subject: `Account Banned ⛔ Your Account Has Been Blocked on CampusConnect`,
        template: 'accountban.ejs',
        context,
      });
      this.logger.debug(`Email send to ${email}`);
    } catch (error) {
      this.logger.error(
        `Error checking post content for job : ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
  async sendEmailToAdminForUserBanned(
    data: UserBannedAdminNotificationJob['data'],
  ) {
    const { email, bannedUsername, firstName } = data;
    this.logger.debug('content policy violation by:', email);
    try {
      const context = {
        username: bannedUsername,
        firstName,
        // content,
      };
      await this._mailService.sendMail({
        to: email,
        from: `CampusConnect ${this._configService.get<string>('SMTP_SERVICE_EMAIL')}`,
        subject: `🚫 User Account Blocked - Content Policy Violation`,
        template: 'inform-admin-about-user-ban.ejs',
        context,
      });
      this.logger.debug(`Email send to ${email}`);
    } catch (error) {
      this.logger.error(
        `Error checking post content for job : ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  async onCompleted(
    job: Job<
      | UnsafePostAlertJob['data']
      | UserAccountBlockAlertJob['data']
      | UserBannedAdminNotificationJob['data']
    >,
  ) {
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
