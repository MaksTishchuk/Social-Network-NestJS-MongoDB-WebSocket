import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, now} from 'mongoose';
import * as mongoose from 'mongoose';
import {EnumGender} from "./enums/gender.enum";
import {Post} from "../post/post.model";
import {Comment} from "../comment/comment.model";
import {Like} from "../likes/likes.model";
import {Invitation} from "../invitation/invitation.model";

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {

  @Prop({required: true, unique: true})
  email: string

  @Prop({required: true, unique: true})
  username: string

  @Prop({ required: true })
  password: string

  @Prop()
  hashedRefreshToken: string

  @Prop({default: ''})
  country: string

  @Prop({default: ''})
  city: string

  @Prop({default: ''})
  birthday: string

  @Prop({enum: EnumGender, default: 'unselect'})
  gender: string

  @Prop({default: ''})
  avatarPath: string

  @Prop({default: [], type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Invitation'}]})
  sentInvitations: Invitation[]

  @Prop({default: [], type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Invitation'}]})
  receivedInvitations: Invitation[]

  @Prop({default: [], type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
  friends: User[]

  @Prop({default: [], type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]})
  posts: Post[]

  @Prop({default: [], type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]})
  comments: Comment[]

  @Prop({default: [], type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Like'}]})
  likes: Like[]

  @Prop({required: true, default: now()})
  createdAt: Date

  @Prop({default: now()})
  updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User);