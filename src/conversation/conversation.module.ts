import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {Message, MessageSchema} from "../message/message.model";
import {Conversation, ConversationSchema} from "./conversation.model";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {name: Conversation.name, schema: ConversationSchema},
      {name: Message.name, schema: MessageSchema}
    ])
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService]
})
export class ConversationModule {}
