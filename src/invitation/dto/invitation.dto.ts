import {IsObjectId} from "class-validator-mongo-object-id";

export class InvitationDto {
  @IsObjectId()
  friendId: string
}