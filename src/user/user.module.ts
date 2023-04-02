import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {User, UserSchema} from "./user.model";
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule} from "@nestjs/config";
import {FilesService} from "../files/files.service";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema}
    ])
  ],
  controllers: [UserController],
  providers: [UserService, FilesService],
  exports: [UserService]
})
export class UserModule {}
