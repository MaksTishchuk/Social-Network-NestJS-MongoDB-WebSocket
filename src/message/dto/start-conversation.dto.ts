import {IsObjectId} from "class-validator-mongo-object-id";

export class StartConversationDto {

  @IsObjectId()
  userFrom: string

  @IsObjectId()
  userTo: string
}