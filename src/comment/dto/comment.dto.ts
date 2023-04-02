import {IsString} from "class-validator";
import {IsObjectId} from "class-validator-mongo-object-id";

export class CommentDto {

  @IsString()
  comment: string

  @IsObjectId()
  postId: string
}