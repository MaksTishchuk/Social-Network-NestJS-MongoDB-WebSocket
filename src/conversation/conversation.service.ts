import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../user/user.model";
import {Model, Types} from "mongoose";
import {Message, MessageDocument} from "../message/message.model";
import {Conversation, ConversationDocument} from "./conversation.model";

@Injectable()
export class ConversationService {

  constructor(
    @InjectModel(Conversation.name) private readonly conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
  ) {}

  async createConversation(userId: Types.ObjectId, secondUserId: Types.ObjectId) {
    const conversation = await this.conversationModel.findOne({
      $or: [{firstUser: userId, secondUser: secondUserId}, {firstUser: secondUserId, secondUser: userId}]
    })
    if (conversation) {
      return conversation.populate([
        {path: 'firstUser', select: '_id username avatarPath'},
        {path: 'secondUser', select: '_id username avatarPath'},
        {
          path: 'messages', populate: [
            {path: 'userFrom', select: '_id username avatarPath'},
            {path: 'userTo', select: '_id username avatarPath'}
          ]
        }
      ])
    }
    return this.conversationModel.create({
      firstUser: userId,
      secondUser: secondUserId
    })
  }

  async getUserConversationById(userId: Types.ObjectId, conversationId: Types.ObjectId) {
    const conversation = await this.conversationModel.findOne({
      $or: [{_id: conversationId, firstUser: userId}, {_id: conversationId, secondUser: userId}]
    }).populate([
      {path: 'firstUser', select: '_id username avatarPath'},
      {path: 'secondUser', select: '_id username avatarPath'},
      {
        path: 'messages', populate: [
          {path: 'userFrom', select: '_id username avatarPath'},
          {path: 'userTo', select: '_id username avatarPath'}
        ]
      }
    ])
    return conversation
  }

  async getConversationById(conversationId: Types.ObjectId) {
    const conversation = await this.conversationModel.findById({_id: conversationId})
      .populate([
        {path: 'firstUser', select: '_id username avatarPath'},
        {path: 'secondUser', select: '_id username avatarPath'},
        {
          path: 'messages', populate: [
            {path: 'userFrom', select: '_id username avatarPath'},
            {path: 'userTo', select: '_id username avatarPath'}
          ]
        }
      ])
    return conversation
  }

  async getAllConversationsByUserId(userId: Types.ObjectId) {
    const conversations = await this.conversationModel.find({
      $or: [{firstUser: userId}, {secondUser: userId}]
    }).populate([
      {path: 'firstUser', select: '_id username avatarPath'},
      {path: 'secondUser', select: '_id username avatarPath'}
    ])
    return conversations
  }
}
