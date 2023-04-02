import {IsObjectId} from "class-validator-mongo-object-id";

export class DeleteMessageDto {

  @IsObjectId()
  conversationId: string

  @IsObjectId()
  messageId: string

  @IsObjectId()
  userFrom: string
}