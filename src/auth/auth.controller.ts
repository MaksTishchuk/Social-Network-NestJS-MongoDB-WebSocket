import {
  Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {Request} from "express";
import {AuthCreateUserDto} from "./dto/auth-create-user.dto";
import {Tokens} from "./types/tokens.types";
import {AuthLoginDto} from "./dto/auth-login.dto";
import {AccessTokenGuard} from "../common/guards/access-token-guard";
import {GetCurrentUserId} from "../common/decorators/get-current-user-id.decorator";
import {RefreshTokenGuard} from "../common/guards/refresh-token-guard";
import {GetCurrentUser} from "../common/decorators/get-current-user.decorator";
import {GoogleAuthGuard} from "../common/guards/google-auth-guard";
import {Types} from "mongoose";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() authCreateUserDto: AuthCreateUserDto): Promise<Tokens> {
    return this.authService.register(authCreateUserDto)
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() authLoginDto: AuthLoginDto): Promise<Tokens> {
    return this.authService.login(authLoginDto)
  }

  @Post('/logout')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(new Types.ObjectId(userId))
  }

  @Post('/refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(new Types.ObjectId(userId), refreshToken)
  }

  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {}

  @Get('/google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() request: Request) {
    return this.authService.googleAuth(request.user)
  }
}
