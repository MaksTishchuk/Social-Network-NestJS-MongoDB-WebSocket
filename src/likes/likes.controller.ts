import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import { LikesService } from './likes.service';
import {AccessTokenGuard} from "../common/guards/access-token-guard";
import {GetCurrentUserId} from "../common/decorators/get-current-user-id.decorator";
import {Types} from "mongoose";
import {IdValidationPipe} from "../common/pipes/id.validation.pipe";

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get('check-exists/:postId')
  @UseGuards(AccessTokenGuard)
  async checkExistsLike(
    @GetCurrentUserId() userId: string,
    @Param('postId', IdValidationPipe) postId: string
  ) {
    return this.likesService.checkExistsLike(new Types.ObjectId(userId), new Types.ObjectId(postId))
  }

  @Patch(':postId')
  @UseGuards(AccessTokenGuard)
  async addOrRemoveLike(
    @GetCurrentUserId() userId: string,
    @Param('postId', IdValidationPipe) postId: string
  ) {
    return this.likesService.addOrRemoveLike(new Types.ObjectId(userId), new Types.ObjectId(postId))
  }

  @Get('count-likes/:postId')
  async getPostLikesCount(@Param('postId', IdValidationPipe) postId: string) {
    return this.likesService.getPostLikesCount(new Types.ObjectId(postId))
  }

  @Get('')
  async getAllLikes() {
    return this.likesService.getAllLikes()
  }

  @Get('by-post/:postId')
  async getLikesByPostId(@Param('postId', IdValidationPipe) postId: string) {
    return this.likesService.getLikesByPostId(new Types.ObjectId(postId))
  }

  @Get(':likeId')
  async getLikeById(@Param('likeId', IdValidationPipe) likeId: string) {
    return this.likesService.getLikeById(new Types.ObjectId(likeId))
  }
}
