import {
  ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";
import {MessageService} from "./message.service";
import {ConversationService} from "../conversation/conversation.service";
import {Types} from "mongoose";
import {MessageDto} from "./dto/message.dto";
import {DeleteMessageDto} from "./dto/delete-message.dto";
import {Server, Socket} from "socket.io";
import {StartConversationDto} from "./dto/start-conversation.dto";

@WebSocketGateway(80, {cors: true})
export class MessageGateway {

  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService
  ) {}


  @WebSocketServer()
  server: Server

  @SubscribeMessage('joinRoom')
  async handleRoomJoin(@ConnectedSocket() client: Socket, @MessageBody() dto: StartConversationDto) {
    const conversation = await this.conversationService.createConversation(new Types.ObjectId(dto.userFrom), new Types.ObjectId(dto.userTo))
    client.join(conversation.id)
    client.emit('joinedRoom', conversation.id)
    this.server.to(conversation.id).emit('conversation', conversation.messages)
  }

  @SubscribeMessage('message:get')
  async getMessages(@MessageBody('conversationId') conversationId: string) {
    const conversation = await this.conversationService.getConversationById(new Types.ObjectId(conversationId))
    this.server.to(conversationId).emit('conversation', conversation.messages)
  }

  @SubscribeMessage('message:create')
  async createMessage(@MessageBody() dto: MessageDto) {
    await this.messageService.createMessage(new Types.ObjectId(dto.userFrom), dto)
    await this.getMessages(dto.conversationId)
  }

  @SubscribeMessage('message:update')
  async updateMessage(@MessageBody() dto: MessageDto) {
    await this.messageService.updateMessage(
      new Types.ObjectId(dto.userFrom),
      new Types.ObjectId(dto.messageId),
      dto,
    )
    await this.getMessages(dto.conversationId)
  }

  @SubscribeMessage('message:delete')
  async deleteMessage(@MessageBody() dto: DeleteMessageDto) {
    await this.messageService.deleteMessage(
      new Types.ObjectId(dto.userFrom),
      new Types.ObjectId(dto.messageId),
      new Types.ObjectId(dto.conversationId),
    )
    await this.getMessages(dto.conversationId)
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(@ConnectedSocket() client: Socket, @MessageBody('conversationId') conversationId: string) {
    client.leave(conversationId)
    client.emit('leftRoom', conversationId)
  }
}