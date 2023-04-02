import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import {AccessTokenGuard} from "../common/guards/access-token-guard";
import {GetCurrentUserId} from "../common/decorators/get-current-user-id.decorator";
import {Types} from "mongoose";
import {IdValidationPipe} from "../common/pipes/id.validation.pipe";
import {ConversationDto} from "./dto/conversation.dto";

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('')
  @UseGuards(AccessTokenGuard)
  async createConversation(
    @GetCurrentUserId() userId: string,
    @Body() dto: ConversationDto
  ) {
    return this.conversationService.createConversation(new Types.ObjectId(userId), new Types.ObjectId(dto.secondUserId))
  }

  @Get('')
  @UseGuards(AccessTokenGuard)
  async getAllConversationsByUserId(
    @GetCurrentUserId() userId: string
  ) {
    return this.conversationService.getAllConversationsByUserId(new Types.ObjectId(userId))
  }

  @Get(':conversationId')
  @UseGuards(AccessTokenGuard)
  async getUserConversationById(
    @GetCurrentUserId() userId: string,
    @Param('conversationId', IdValidationPipe) conversationId: string
  ) {
    return this.conversationService.getUserConversationById(new Types.ObjectId(userId), new Types.ObjectId(conversationId))
  }
}
