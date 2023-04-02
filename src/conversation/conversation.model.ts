import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, now} from 'mongoose';
import * as mongoose from 'mongoose';
import {User} from "../user/user.model";
import {Message} from "../message/message.model";

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({timestamps: true})
export class Conversation {

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]})
  messages: Message[]

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  firstUser: User

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  secondUser: User

  @Prop({required: true, default: now()})
  createdAt: Date

  @Prop({default: now()})
  updatedAt: Date
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);