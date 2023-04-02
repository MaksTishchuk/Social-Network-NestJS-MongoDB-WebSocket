import {Body, Controller, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {InvitationService} from './invitation.service';
import {AccessTokenGuard} from "../common/guards/access-token-guard";
import {GetCurrentUserId} from "../common/decorators/get-current-user-id.decorator";
import {Types} from "mongoose";
import {IdValidationPipe} from "../common/pipes/id.validation.pipe";
import {InvitationDto} from "./dto/invitation.dto";

@Controller('invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {
  }

  @Post('')
  @UseGuards(AccessTokenGuard)
  async sendFriendInvitation(
    @GetCurrentUserId() userId: string,
    @Body() dto: InvitationDto,
  ) {
    return this.invitationService.sendFriendInvitation(new Types.ObjectId(userId), new Types.ObjectId(dto.friendId))
  }

  @Get('get-all')
  @UseGuards(AccessTokenGuard)
  async getAllInvitations() {
    return this.invitationService.getAllInvitations()
  }

  @Get('')
  @UseGuards(AccessTokenGuard)
  async getCurrentUserInvitations(@GetCurrentUserId() userId: string) {
    return this.invitationService.getUserInvitations(new Types.ObjectId(userId))
  }

  @Get(':userId')
  @UseGuards(AccessTokenGuard)
  async getUserInvitations(@Param('userId') userId: string) {
    return this.invitationService.getUserInvitations(new Types.ObjectId(userId))
  }

  @Patch('revoke-invitation/:invitationId/:friendId')
  @UseGuards(AccessTokenGuard)
  async revokeFriendInvitation(
    @GetCurrentUserId() userId: string,
    @Param('invitationId', IdValidationPipe) invitationId: string,
    @Param('friendId', IdValidationPipe) friendId: string
  ) {
    return this.invitationService.revokeFriendInvitation(
      new Types.ObjectId(userId), new Types.ObjectId(friendId), new Types.ObjectId(invitationId)
    )
  }

  @Patch('accept-invitation/:invitationId/:friendId')
  @UseGuards(AccessTokenGuard)
  async acceptFriendInvitation(
    @GetCurrentUserId() userId: string,
    @Param('invitationId', IdValidationPipe) invitationId: string,
    @Param('friendId', IdValidationPipe) friendId: string
  ) {
    return this.invitationService.acceptFriendInvitation(
      new Types.ObjectId(userId), new Types.ObjectId(friendId), new Types.ObjectId(invitationId)
    )
  }

  @Patch('decline-invitation/:invitationId/:friendId')
  @UseGuards(AccessTokenGuard)
  async declineFriendInvitation(
    @GetCurrentUserId() userId: string,
    @Param('invitationId', IdValidationPipe) invitationId: string,
    @Param('friendId', IdValidationPipe) friendId: string
  ) {
    return this.invitationService.declineFriendInvitation(
      new Types.ObjectId(userId), new Types.ObjectId(friendId), new Types.ObjectId(invitationId)
    )
  }
}
