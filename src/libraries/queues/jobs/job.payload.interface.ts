import { QueueEventJobPattern } from './job.pattern';

export interface PostCreatedJob {
  pattern: QueueEventJobPattern.POST_CREATED;
  data: {
    postId: string;
  };
}
