import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {Post, PostSchema} from "./post.model";
import {UserModule} from "../user/user.module";
import {User, UserSchema} from "../user/user.model";
import {FilesService} from "../files/files.service";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {name: Post.name, schema: PostSchema},
      {name: User.name, schema: UserSchema}
    ]),
    UserModule
  ],
  controllers: [PostController],
  providers: [PostService, FilesService],
  exports: [PostService]
})
export class PostModule {}
