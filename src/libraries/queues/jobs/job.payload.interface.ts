import { QueueEventJobPattern } from './job.pattern';

export interface PostCreatedJob {
  pattern: QueueEventJobPattern.POST_CREATED;
  data: {
    postId: string;
  };
}
export interface UnsafePostAlertJob {
  pattern: QueueEventJobPattern.CONTENT_MODERATION_NOTIFICATION_FOR_USER;
  data: {
    email: string;
    username: string;
  };
}
export interface UserAccountBlockAlertJob {
  pattern: QueueEventJobPattern.CONTENT_MODERATION_NOTIFICATION_ACCOUNT_BLOCKED_FOR_USER;
  data: {
    email: string;
    username: string;
  };
}

export interface UserBannedAdminNotificationJob {
  pattern: QueueEventJobPattern.CONTENT_MODERATION_NOTIFICATION_ACCOUNT_BLOCKED_FOR_ADMIN;
  data: {
    email: string;
    firstName: string;
    bannedUsername: string;
  };
}
