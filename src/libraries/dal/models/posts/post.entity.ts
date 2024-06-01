import mongoose, { Document, Model } from 'mongoose';

export interface IPost {
  objType?: string;
  userId: mongoose.Schema.Types.ObjectId;
  content: string;
  is_safe: boolean;
  media: {
    url: string;
    format: string;
    publicId: string;
    resourcetype: string;
    thumbnail_url: string;
    asset_id: string;
  }[];
  likes: {
    userId: string;
  }[];
  comments: {
    userId: string;
    text: string;
  }[];
}

export interface IPostDoc extends IPost, Document {}

export interface IPostModel extends Model<IPostDoc> {}
