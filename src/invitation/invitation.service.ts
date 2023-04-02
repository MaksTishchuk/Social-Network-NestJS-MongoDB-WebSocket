import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {User, UserDocument} from "../user/user.model";
import {UserService} from "../user/user.service";
import {Invitation, InvitationDocument} from "./invitation.model";

@Injectable()
export class InvitationService {

  constructor(
    @InjectModel(Invitation.name) private readonly invitationModel: Model<InvitationDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly userService: UserService
  ) {}

  async sendFriendInvitation(userId: Types.ObjectId, friendId: Types.ObjectId) {
    if (userId === friendId) {throw new BadRequestException('The user cannot send an invitation to himself!')}
    const user = await this.userModel.findById(userId)
    const friend = await this.userModel.findById(friendId)

    const invitationFound = await this.invitationModel.findOne(
      { $or: [{userFrom: userId, userTo: friendId}, {userFrom: friendId, userTo: userId}]}
    )
    if (invitationFound) {throw new BadRequestException('This user already in your invitations!')}
    const checkFriend = user.friends.filter((userFound) => String(userFound) === String(friend._id))
    if (checkFriend.length !== 0) {throw new BadRequestException('This user already in your friends!')}

    const invitation = await this.invitationModel.create({
      userFrom: user._id,
      userTo: friend._id
    })
    user.sentInvitations.push(invitation.id)
    await user.save()
    friend.receivedInvitations.push(invitation.id)
    await friend.save()
    return invitation
  }

  async getAllInvitations() {
    return this.invitationModel.find();
  }

  async getUserInvitations(userId: Types.ObjectId) {
    const user = await this.userService.getUserById(userId)
    const sentInvitations = await this.invitationModel.find({userFrom: user._id})
      .select('-__v')
      .populate([
        {path: 'userFrom', select: '_id email username avatarPath'},
        {path: 'userTo', select: '_id email username avatarPath'}
      ])
    const receivedInvitations = await this.invitationModel.find({userTo: user._id})
      .select('-__v')
      .populate([
        {path: 'userFrom', select: '_id email username avatarPath'},
        {path: 'userTo', select: '_id email username avatarPath'}
      ])
    return {sentInvitations, receivedInvitations}
  }

  async revokeFriendInvitation(userId: Types.ObjectId, friendId: Types.ObjectId, invitationId: Types.ObjectId) {
    if (userId === friendId) {throw new BadRequestException('The user cannot revoke an invitation to himself!')}
    const user = await this.userModel.findById(userId)
    const friend = await this.userModel.findById(friendId)
    const invitation = await this.invitationModel.findOne({_id: invitationId, userFrom: user._id, userTo: friend._id})
    if (!invitation) {throw new NotFoundException('This invitation was not found!')}
    await this.invitationModel.deleteOne({_id: invitationId, userFrom: user._id, userTo: friend._id})
    user.sentInvitations = user.sentInvitations.filter((inv) => String(inv) !== String(invitation._id))
    await user.save()
    friend.receivedInvitations = friend.receivedInvitations.filter((inv) => String(inv) !== String(invitation._id))
    await friend.save()
    return {'success': true, 'message': `Invitation from ${user.username} to ${friend.username} has been deleted!`}
  }

  async acceptFriendInvitation(userId: Types.ObjectId, friendId: Types.ObjectId, invitationId: Types.ObjectId) {
    const {user, friend, invitation} = await this.checkDataInvitationAndDelete(userId, friendId, invitationId)
    friend.sentInvitations = friend.sentInvitations.filter((inv) => String(inv) !== String(invitation._id))
    friend.friends.push(user.id)
    await friend.save()
    user.receivedInvitations = user.receivedInvitations.filter((inv) => String(inv) !== String(invitation._id))
    user.friends.push(friend.id)
    return await user.save()
  }

  async declineFriendInvitation(userId: Types.ObjectId, friendId: Types.ObjectId, invitationId: Types.ObjectId) {
    const {user, friend, invitation} = await this.checkDataInvitationAndDelete(userId, friendId, invitationId)
    friend.sentInvitations = friend.sentInvitations.filter((inv) => String(inv) !== String(invitation._id))
    await friend.save()
    user.receivedInvitations = user.receivedInvitations.filter((inv) => String(inv) !== String(invitation._id))
    return await user.save()
  }

  private async checkDataInvitationAndDelete(userId: Types.ObjectId, friendId: Types.ObjectId, invitationId: Types.ObjectId) {
    const user = await this.userModel.findById(userId).populate('friends')
    const friend = await this.userModel.findById(friendId).populate('friends')
    const invitation = await this.invitationModel.findOne({_id: invitationId, userFrom: friend._id, userTo: user._id})
    if (!invitation) {throw new NotFoundException('This invitation was not found!')}
    await this.invitationModel.deleteOne({_id: invitationId, userFrom: friend._id, userTo: user._id})
    return {user, friend, invitation}
  }

}
