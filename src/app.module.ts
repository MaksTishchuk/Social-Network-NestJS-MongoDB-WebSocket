import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ServeStaticModule} from "@nestjs/serve-static";
import {MongooseModule} from "@nestjs/mongoose";
import { UserModule } from './user/user.module';
import * as path from 'path'
import {getMongoConfig} from "./config/mongo.config";
import { MessageModule } from './message/message.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { LikesModule } from './likes/likes.module';
import { ConversationModule } from './conversation/conversation.module';
import { FilesModule } from "./files/files.module";
import { InvitationModule } from './invitation/invitation.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    ServeStaticModule.forRoot({serveRoot: '/files', rootPath: path.resolve(__dirname, 'static')}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig
    }),
    AuthModule,
    UserModule,
    MessageModule,
    PostModule,
    CommentModule,
    LikesModule,
    ConversationModule,
    FilesModule,
    InvitationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
