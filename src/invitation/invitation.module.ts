import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../user/user.model";
import {UserModule} from "../user/user.module";
import {Invitation, InvitationSchema} from "./invitation.model";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {name: Invitation.name, schema: InvitationSchema},
      {name: User.name, schema: UserSchema}
    ]),
    UserModule
  ],
  controllers: [InvitationController],
  providers: [InvitationService]
})
export class InvitationModule {}
