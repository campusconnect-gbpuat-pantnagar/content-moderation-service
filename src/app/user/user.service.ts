import { Inject, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import {
  IUserDoc,
  IUserModel,
} from 'src/libraries/dal/models/user/user.entity';

@Injectable()
export class UserService {
  constructor(@Inject('userModel') private readonly userModel: IUserModel) {}

  async findById(userId: mongoose.Schema.Types.ObjectId): Promise<IUserDoc> {
    return this.userModel.findById(userId).exec();
  }
  async findAdmins(): Promise<IUserDoc[]> {
    return this.userModel.find({ role: 'admin', isEmailVerified: true }).exec();
  }
  async markUserAsPermanentBlock(
    userId: mongoose.Schema.Types.ObjectId,
  ): Promise<IUserDoc> {
    return this.userModel
      .findByIdAndUpdate(userId, {
        isPermanentBlocked: true,
      })
      .exec();
  }
}
