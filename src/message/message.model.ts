import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, now} from 'mongoose';
import * as mongoose from 'mongoose';
import {User} from "../user/user.model";
import {Conversation} from "../conversation/conversation.model";

export type MessageDocument = HydratedDocument<Message>;

@Schema({timestamps: true})
export class Message {

  @Prop({required: true})
  message: string

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Conversation'})
  conversation: Conversation

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  userFrom: User

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  userTo: User

  @Prop({required: true, default: now()})
  createdAt: Date

  @Prop({default: now()})
  updatedAt: Date
}

export const MessageSchema = SchemaFactory.createForClass(Message);