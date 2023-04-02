import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, now} from 'mongoose';
import * as mongoose from 'mongoose';
import {User} from "../user/user.model";

export type InvitationDocument = HydratedDocument<Invitation>;

@Schema({timestamps: true})
export class Invitation {

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  userFrom: User

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  userTo: User

  @Prop({required: true, default: now()})
  createdAt: Date

  @Prop({default: now()})
  updatedAt: Date
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);