import {IsOptional, IsString} from "class-validator";
import {IsObjectId} from "class-validator-mongo-object-id";

export class MessageDto {

  @IsString()
  message: string

  @IsOptional()
  @IsObjectId()
  messageId?: string

  @IsObjectId()
  conversationId: string

  @IsObjectId()
  userFrom: string

  @IsObjectId()
  userTo: string
}