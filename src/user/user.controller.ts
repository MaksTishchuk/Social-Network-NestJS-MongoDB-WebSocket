import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Query, UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { UserService } from './user.service';
import {Types} from "mongoose";
import {UserDto} from "./dto/user.dto";
import {IdValidationPipe} from "../common/pipes/id.validation.pipe";
import {AccessTokenGuard} from "../common/guards/access-token-guard";
import {GetCurrentUserId} from "../common/decorators/get-current-user-id.decorator";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(AccessTokenGuard)
  async getProfile(@GetCurrentUserId() userId: string) {
    return this.userService.getUser(new Types.ObjectId(userId))
  }

  @Put('profile')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async UpdateProfile(
    @GetCurrentUserId() userId: string,
    @Body() dto: UserDto,
    @UploadedFile() avatar?
  ) {
    return this.userService.updateProfile(new Types.ObjectId(userId), dto, avatar)
  }

  @Get('search')
  async findUsers(@Query('searchTerm') searchTerm: string) {
    return this.userService.findUsers(searchTerm)
  }

  @Get(':id')
  async getUserById(@Param('id', IdValidationPipe) id: string) {
    return this.userService.getUserById(new Types.ObjectId(id))
  }

  @Patch('remove-friend/:friendId')
  @UseGuards(AccessTokenGuard)
  async addOrRemoveFriend(
    @GetCurrentUserId() userId: string,
    @Param('friendId', IdValidationPipe) friendId: string
  ) {
    return this.userService.removeFriend(new Types.ObjectId(userId), new Types.ObjectId(friendId))
  }

  // @Patch('add-or-remove-friend/:toUserId')
  // @UseGuards(AccessTokenGuard)
  // async addOrRemoveFriend(
  //   @GetCurrentUserId() fromUserId: string,
  //   @Param('toUserId', IdValidationPipe) toUserId: string
  // ) {
  //   return this.userService.addOrRemoveFriend(new Types.ObjectId(fromUserId), new Types.ObjectId(toUserId))
  // }
}
