import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {Message, MessageSchema} from "./message.model";
import {Conversation, ConversationSchema} from "../conversation/conversation.model";
import {ConversationModule} from "../conversation/conversation.module";
import {MessageGateway} from "./message.gateway";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {name: Message.name, schema: MessageSchema},
      {name: Conversation.name, schema: ConversationSchema}
    ]),
    ConversationModule
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway]
})
export class MessageModule {}
