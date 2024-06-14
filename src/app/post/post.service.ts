import { Inject, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import {
  IPostDoc,
  IPostModel,
} from 'src/libraries/dal/models/posts/post.entity';
import * as moment from 'moment';
@Injectable()
export class PostService {
  constructor(@Inject('PostModel') private readonly postModel: IPostModel) {}

  async getPostById(postId: mongoose.Types.ObjectId): Promise<IPostDoc | null> {
    return this.postModel.findById(postId).exec();
  }

  async updatePostIsSafeById(
    postId: mongoose.Types.ObjectId,
  ): Promise<IPostDoc | null> {
    return this.postModel
      .findByIdAndUpdate(postId, { $set: { is_safe: false } }, { new: true })
      .exec();
  }

  async getUnsafePostCountOfUser(userId: mongoose.Schema.Types.ObjectId) {
    const tenDaysAgo = moment().subtract(10, 'days').toDate();
    const unsafePostCount = await this.postModel.countDocuments({
      userId: userId,
      is_safe: false,
      createdAt: { $gte: tenDaysAgo },
    });
    return unsafePostCount;
  }
}
