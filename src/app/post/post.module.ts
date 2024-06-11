// job.module.ts
import { Module } from '@nestjs/common';

import { DalService } from 'src/libraries/dal/dal.service';
import { PostService } from './post.service';
import {
  PostModel,
  PostModelProvider,
} from 'src/libraries/dal/models/posts/post.schema';

const postDbService = {
  provide: 'PostDBService',
  useFactory: async () => {
    const service = new DalService();
    await service.connect(process.env.POST_DB_URI, {}, 'postDB');
    return service;
  },
};

const PROVIDERS = [postDbService];
@Module({
  providers: [...PROVIDERS, PostModelProvider, PostModel, PostService],
  exports: [PostService, PostModel, PostModelProvider],
})
export class PostModule {}
