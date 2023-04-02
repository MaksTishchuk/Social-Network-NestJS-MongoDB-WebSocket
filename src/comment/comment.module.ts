import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {Comment, CommentSchema} from "./comment.model";
import {UserModule} from "../user/user.module";
import {PostModule} from "../post/post.module";
import {User, UserSchema} from "../user/user.model";
import {Post, PostSchema} from "../post/post.model";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {name: Comment.name, schema: CommentSchema},
      {name: User.name, schema: UserSchema},
      {name: Post.name, schema: PostSchema}
    ]),
    UserModule,
    PostModule
  ],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
