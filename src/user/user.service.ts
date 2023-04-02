import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./user.model";
import {Model, Types} from "mongoose";
import {UserDto} from "./dto/user.dto";
import {FilesService} from "../files/files.service";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private fileService: FilesService
  ) {}

  async getUser(_id: Types.ObjectId) {
    const user = await this.getUserById(_id)
    return user
  }

  async findUsers(searchTerm: string) {
    const options = {$or: [{username: new RegExp(searchTerm, 'i')}]}
    const users = await this.userModel.find({...options})
      .select('-__v -password -hashedRefreshToken')
      .populate('friends', '_id email username avatarPath')
      .sort({createdAt: 'desc'})
      .exec()
    return users
  }

  async getUserById(_id: Types.ObjectId) {
    const user = await this.userModel.findById(_id)
      .select('-__v -password -hashedRefreshToken')
      .populate([
        {path: 'friends', select: '_id email username avatarPath'},
        {path: 'sentInvitations', select: '-__v', populate: [
            {path: 'userFrom', select: '_id email username avatarPath'},
            {path: 'userTo', select: '_id email username avatarPath'}
        ]},
        {path: 'receivedInvitations', select: '-__v', populate: [
            {path: 'userFrom', select: '_id email username avatarPath'},
            {path: 'userTo', select: '_id email username avatarPath'}
        ]},
        {path: 'posts', select: '-__v', populate: [
            {path: 'user', select: '_id email username avatarPath'},
            {path: 'comments', select: '-__v', populate: {path: 'user', select: '_id email username avatarPath'}},
            {path: 'likes', select: '-__v', populate: {path: 'user', select: '_id email username avatarPath'}}
        ]},
        {path: 'comments', select: '-__v', populate: [
            {path: 'user', select: '_id email username avatarPath'},
            {path: 'post', select: '-__v', populate: {path: 'user', select: '_id email username avatarPath'}},
        ]},
        {path: 'likes', select: '-__v', populate: [
            {path: 'user', select: '_id email username avatarPath'},
            {path: 'post', select: '-__v', populate: {path: 'user', select: '_id email username avatarPath'}},
        ]}
      ])
    if (!user) throw new UnauthorizedException('User not found!')
    return user
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({email}, '-__v')
      .populate('friends', '-password -__v')
    if (!user) throw new UnauthorizedException('User not found!')
    return user
  }

  async updateProfile(userId: Types.ObjectId, dto: UserDto, avatar) {
    const user = await this.getUserById(userId)
    if (avatar) {
      this.fileService.removeFile(user.avatarPath)
      avatar = await this.fileService.saveFile(avatar, 'avatars')
    }
    user.username = typeof dto.username !== 'undefined' ? dto.username : user.username
    user.country = typeof dto.country !== 'undefined' ? dto.country : user.country
    user.city = typeof dto.city !== 'undefined' ? dto.city : user.city
    user.birthday = typeof dto.birthday !== 'undefined' ? dto.birthday : user.birthday
    user.gender = typeof dto.gender !== 'undefined' ? dto.gender : user.gender
    user.avatarPath = typeof avatar !== 'undefined' ? avatar : user.avatarPath
    return await user.save()
  }

   async removeFriend(userId: Types.ObjectId, friendId: Types.ObjectId) {
    const user = await this.userModel.findById(userId)
    const friend = await this.userModel.findById(friendId)
    const checkUser = user.friends.filter((userFound) => String(userFound) === String(friend._id))
    if (checkUser.length !== 0) {
      user.friends = user.friends.filter((userFound) => String(userFound) !== String(friend._id))
      await user.save()
      friend.friends = friend.friends.filter((userFound) => String(userFound) !== String(user._id))
      await friend.save()
    }
    return this.getUserById(user.id)
  }

  // async addOrRemoveFriend(fromUserId: Types.ObjectId, toUserId: Types.ObjectId) {
  //   const fromUser = await this.getUserById(fromUserId)
  //   const toUser = await this.getUserById(toUserId)
  //   const checkUser = fromUser.friends.filter((user) => user.email === toUser.email)
  //   if (checkUser.length !== 0) {
  //     fromUser.friends = fromUser.friends.filter((user) => user.email !== toUser.email)
  //     toUser.friends = toUser.friends.filter((user) => user.email !== fromUser.email)
  //   } else {
  //     fromUser.friends.push(toUser.id)
  //     toUser.friends.push(fromUser.id)
  //   }
  //   await fromUser.save()
  //   await toUser.save()
  //   return this.getUserById(fromUser.id)
  // }
}
