import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../user/user.model";
import {JwtModule} from "@nestjs/jwt";
import {AccessTokenStrategy} from "./strategies/accessToken.strategy";
import {RefreshTokenStrategy} from "./strategies/refreshToken.strategy";
import {GoogleStrategy} from "./strategies/google.strategy";
import {SessionSerializer} from "./serializers/serializer";

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema}
    ])
  ],
  controllers: [AuthController],
  providers: [
    AuthService, AccessTokenStrategy, RefreshTokenStrategy, GoogleStrategy, SessionSerializer
  ],
  exports: [AuthService]
})
export class AuthModule {}
