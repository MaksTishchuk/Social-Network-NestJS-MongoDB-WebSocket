import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {Message, MessageDocument} from "./message.model";
import {MessageDto} from "./dto/message.dto";
import {Conversation, ConversationDocument} from "../conversation/conversation.model";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name) private readonly conversationModel: Model<ConversationDocument>
  ) {}

  async createMessage(userId: Types.ObjectId, dto: MessageDto) {
    let conversation = await this.conversationModel.findById(dto.conversationId)
    if (!conversation) throw new NotFoundException('Conversation was not found!')
    const message = await this.messageModel.create({
      message: dto.message,
      conversation: conversation._id,
      userFrom: userId,
      userTo: dto.userTo
    })
    conversation.messages.push(message.id)
    await conversation.save()
    return message.populate([
      {path: 'userFrom', select: '_id username avatarPath'},
      {path: 'userTo', select: '_id username avatarPath'}
    ])
  }

  async getAllMessages() {
    const messages = await this.messageModel.find()
      .sort({createdAt: 'desc'})
      .select('-__v')
      .populate([
        {path: 'userFrom', select: '_id username avatarPath'},
        {path: 'userTo', select: '_id username avatarPath'}
      ])
    return messages
  }

  async getConversationMessages(userId: Types.ObjectId, secondUserId: Types.ObjectId) {
    const messages = await this.messageModel.find(
      { $or: [{userFrom: userId, userTo: secondUserId}, {userFrom: secondUserId, userTo: userId}]}
    )
      .sort({createdAt: 'asc'})
      .select('-__v')
      .populate([
        {path: 'userFrom', select: '_id username avatarPath'},
        {path: 'userTo', select: '_id username avatarPath'}
      ])
    return messages
  }

  async getMessageById(messageId: Types.ObjectId) {
    const message = await this.messageModel.findById({_id: messageId})
      .select('-__v')
      .populate([
        {path: 'userFrom', select: '_id username avatarPath'},
        {path: 'userTo', select: '_id username avatarPath'}
      ])
    if (!message) throw new NotFoundException('Message was not found!')
    return message
  }

  async updateMessage(userId: Types.ObjectId, messageId: Types.ObjectId, dto: MessageDto) {
    const message = await this.messageModel.findOne({_id: messageId, userFrom: userId})
    if (!message) throw new NotFoundException('Message cannot be updated!')
    await this.messageModel.updateOne({_id: messageId}, {message: dto.message})
    return this.getMessageById(messageId)
  }

  async deleteMessage(userId: Types.ObjectId, messageId: Types.ObjectId, conversationId: Types.ObjectId) {
    let conversation = await this.conversationModel.findById(conversationId)
    if (!conversation) throw new NotFoundException('Conversation was not found!')
    const message = await this.messageModel.findOne({_id: messageId, userFrom: userId})
    if (!message) throw new NotFoundException('Message cannot be deleted!')
    await this.messageModel.deleteOne({_id: messageId})
    conversation.messages = conversation.messages.filter((msg) => String(msg) !== String(message._id))
    await conversation.save()
    return {'success': true, 'message': `Message with Id "${messageId}" has been deleted!`}
  }
}
