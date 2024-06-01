import { Inject, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { IPostDoc } from 'src/libraries/dal/models/posts/post.entity';

@Injectable()
export class PostService {
  constructor(@Inject('POST_MODEL') private _post: Model<IPostDoc>) {}

  async getPostById(postId: mongoose.Types.ObjectId): Promise<IPostDoc | null> {
    return this._post.findById(postId).exec();
  }
}
