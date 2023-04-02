import {IsObjectId} from "class-validator-mongo-object-id";

export class ConversationDto {
  @IsObjectId()
  secondUserId: string
}