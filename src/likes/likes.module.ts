import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {Like, LikeSchema} from "./likes.model";
import {User, UserSchema} from "../user/user.model";
import {Post, PostSchema} from "../post/post.model";
import {UserModule} from "../user/user.module";
import {PostModule} from "../post/post.module";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {name: Like.name, schema: LikeSchema},
      {name: User.name, schema: UserSchema},
      {name: Post.name, schema: PostSchema}
    ]),
    UserModule,
    PostModule
  ],
  controllers: [LikesController],
  providers: [LikesService]
})
export class LikesModule {}
