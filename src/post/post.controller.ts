import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { PostService } from './post.service';
import {AccessTokenGuard} from "../common/guards/access-token-guard";
import {GetCurrentUserId} from "../common/decorators/get-current-user-id.decorator";
import {Types} from "mongoose";
import {IdValidationPipe} from "../common/pipes/id.validation.pipe";
import {PostDto} from "./dto/post.dto";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @GetCurrentUserId() userId: string,
    @Body() dto: PostDto,
    @UploadedFile() image?
  ) {
    return this.postService.createPost(new Types.ObjectId(userId), dto, image)
  }

  @Get('')
  async getAllPosts() {
    return this.postService.getAllPosts()
  }

  @Get('by-user-id/:userId')
  async getPostsByUserId(@Param('userId') userId: string) {
    return this.postService.getPostsByUserId(new Types.ObjectId(userId))
  }

  @Get(':postId')
  async getPostById(@Param('postId', IdValidationPipe) postId: string) {
    return this.postService.getPostById(new Types.ObjectId(postId))
  }

  @Put(':postId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updatePost(
    @GetCurrentUserId() userId: string,
    @Param('postId', IdValidationPipe) postId: string,
    @Body() dto: PostDto,
    @UploadedFile() image?
  ) {
    return this.postService.updatePost(new Types.ObjectId(userId), new Types.ObjectId(postId), dto, image)
  }

  @Delete(':postId')
  @UseGuards(AccessTokenGuard)
  async deletePost(
    @GetCurrentUserId() userId: string,
    @Param('postId', IdValidationPipe) postId: string
  ) {
    return this.postService.deletePost(new Types.ObjectId(userId), new Types.ObjectId(postId))
  }
}
