import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import { CommentService } from './comment.service';
import {IdValidationPipe} from "../common/pipes/id.validation.pipe";
import {Types} from "mongoose";
import {GetCurrentUserId} from "../common/decorators/get-current-user-id.decorator";
import {CommentDto} from "./dto/comment.dto";
import {AccessTokenGuard} from "../common/guards/access-token-guard";

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('')
  @UseGuards(AccessTokenGuard)
  async createComment(
    @GetCurrentUserId() userId: string,
    @Body() dto: CommentDto
  ) {
    return this.commentService.createComment(new Types.ObjectId(userId), dto)
  }

  @Get('')
  async getAllComments() {
    return this.commentService.getAllComments()
  }

  @Get('by-post/:postId')
  async getCommentsByPostId(@Param('postId', IdValidationPipe) postId: string) {
    return this.commentService.getCommentsByPostId(new Types.ObjectId(postId))
  }

  @Get(':commentId')
  async getCommentById(@Param('commentId', IdValidationPipe) commentId: string) {
    return this.commentService.getCommentById(new Types.ObjectId(commentId))
  }

  @Put(':commentId')
  @UseGuards(AccessTokenGuard)
  async updateComment(
    @GetCurrentUserId() userId: string,
    @Param('commentId', IdValidationPipe) commentId: string,
    @Body() dto: CommentDto
  ) {
    return this.commentService.updateComment(new Types.ObjectId(userId), new Types.ObjectId(commentId), dto)
  }

  @Delete(':commentId')
  @UseGuards(AccessTokenGuard)
  async deleteComment(
    @GetCurrentUserId() userId: string,
    @Param('commentId', IdValidationPipe) commentId: string,
    @Body('postId') postId: string
  ) {
    return this.commentService.deleteComment(
      new Types.ObjectId(userId), new Types.ObjectId(commentId), new Types.ObjectId(postId)
    )
  }
}
