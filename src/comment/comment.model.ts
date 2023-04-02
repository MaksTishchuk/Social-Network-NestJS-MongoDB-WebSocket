import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, now} from 'mongoose';
import * as mongoose from 'mongoose';
import {User} from "../user/user.model";
import {Post} from "../post/post.model";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({timestamps: true})
export class Comment {

  @Prop({required: true})
  comment: string

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user: User

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Post'})
  post: Post

  @Prop({required: true, default: now()})
  createdAt: Date

  @Prop({default: now()})
  updatedAt: Date
}

export const CommentSchema = SchemaFactory.createForClass(Comment);