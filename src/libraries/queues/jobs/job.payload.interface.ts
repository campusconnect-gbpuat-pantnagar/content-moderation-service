import { QueueEventJobPattern } from './job.pattern';

export interface PostCreatedJOb {
  pattern: QueueEventJobPattern.POST_CREATED;
  data: {
    postId: string;
  };
}
