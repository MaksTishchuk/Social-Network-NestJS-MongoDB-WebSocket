import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, now} from 'mongoose';
import * as mongoose from 'mongoose';
import {User} from "../user/user.model";
import {Comment} from "../comment/comment.model";
import {Like} from "../likes/likes.model";

export type PostDocument = HydratedDocument<Post>;

@Schema({timestamps: true})
export class Post {

  @Prop({required: true})
  content: string

  @Prop()
  image?: string

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user: User

  @Prop({default: [], type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]})
  comments: Comment[]

  @Prop({default: [], type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Like'}]})
  likes: Like[]

  @Prop({required: true, default: now()})
  createdAt: Date

  @Prop({default: now()})
  updatedAt: Date
}

export const PostSchema = SchemaFactory.createForClass(Post);