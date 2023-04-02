import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import { MessageService } from './message.service';
import {AccessTokenGuard} from "../common/guards/access-token-guard";
import {GetCurrentUserId} from "../common/decorators/get-current-user-id.decorator";
import {Types} from "mongoose";
import {IdValidationPipe} from "../common/pipes/id.validation.pipe";
import {MessageDto} from "./dto/message.dto";

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('')
  @UseGuards(AccessTokenGuard)
  async createMessage(
    @GetCurrentUserId() userId: string,
    @Body() dto: MessageDto
  ) {
    return this.messageService.createMessage(new Types.ObjectId(userId), dto)
  }

  @Get('')
  @UseGuards(AccessTokenGuard)
  async getAllMessages() {
    return this.messageService.getAllMessages()
  }

  @Get('conversation/:secondUserId')
  @UseGuards(AccessTokenGuard)
  async getConversationMessages(
    @GetCurrentUserId() userId: string,
    @Param('secondUserId', IdValidationPipe) secondUserId: string
    ) {
    return this.messageService.getConversationMessages(new Types.ObjectId(userId), new Types.ObjectId(secondUserId))
  }

  @Get(':messageId')
  @UseGuards(AccessTokenGuard)
  async getMessageById(@Param('messageId', IdValidationPipe) messageId: string) {
    return this.messageService.getMessageById(new Types.ObjectId(messageId))
  }

  @Put(':messageId')
  @UseGuards(AccessTokenGuard)
  async updateMessage(
    @GetCurrentUserId() userId: string,
    @Param('messageId', IdValidationPipe) messageId: string,
    @Body() dto: MessageDto
  ) {
    return this.messageService.updateMessage(new Types.ObjectId(userId), new Types.ObjectId(messageId), dto)
  }

  @Delete(':conversationId/:messageId')
  @UseGuards(AccessTokenGuard)
  async deleteMessage(
    @GetCurrentUserId() userId: string,
    @Param('messageId', IdValidationPipe) messageId: string,
    @Param('conversationId', IdValidationPipe) conversationId: string
  ) {
    return this.messageService.deleteMessage(
      new Types.ObjectId(userId), new Types.ObjectId(messageId), new Types.ObjectId(conversationId)
    )
  }
}
