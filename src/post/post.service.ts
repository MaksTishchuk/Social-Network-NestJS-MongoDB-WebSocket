import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {Post, PostDocument} from "./post.model";
import {PostDto} from "./dto/post.dto";
import {UserService} from "../user/user.service";
import {User, UserDocument} from "../user/user.model";
import {FilesService} from "../files/files.service";

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly userService: UserService,
    private readonly fileService: FilesService
  ) {}

  async createPost(userId: Types.ObjectId, dto: PostDto, image) {
    const user = await this.userService.getUserById(userId)
    if (image) {
      image = await this.fileService.saveFile(image, 'images')
    }
    const post = await this.postModel.create({
      content: dto.content,
      image: typeof image !== 'undefined' ? image : '',
      user: user._id
    })
    user.posts.push(post.id)
    await user.save()
    return post
  }

  async getAllPosts() {
    const posts = await this.postModel.find()
      .sort({createdAt: 'desc'})
      .select('-__v')
      .populate([
        {path: 'user', select: '_id username avatarPath'},
        {path: 'comments', select: '-__v', populate: {path: 'user', select: '_id email username avatarPath'}},
        {path: 'likes', select: '-__v', populate: {path: 'user', select: '_id email username avatarPath'}}
      ])
    return posts
  }

  async getPostsByUserId(userId: Types.ObjectId) {
    const posts = await this.postModel.find({user: userId}, '-__v')
      .sort({createdAt: 'desc'})
      .select('-__v')
      .populate([
        {path: 'user', select: '_id username avatarPath'},
        {path: 'comments', select: '-__v', populate: {path: 'user', select: '_id email username avatarPath'}},
        {path: 'likes', select: '-__v', populate: {path: 'user', select: '_id email username avatarPath'}}
      ])
    return posts
  }

  async getPostById(postId: Types.ObjectId) {
    const post = await this.postModel.findById({_id: postId})
      .select('-__v')
      .populate([
        {path: 'user', select: '_id username avatarPath'},
        {path: 'comments', select: '-__v', populate: {path: 'user', select: '_id email username avatarPath'}},
        {path: 'likes', select: '-__v', populate: {path: 'user', select: '_id email username avatarPath'}}
      ])
    if (!post) throw new NotFoundException('Post was not found!')
    return post
  }

  async updatePost(userId: Types.ObjectId, postId: Types.ObjectId, dto: PostDto, image) {
    const post = await this.postModel.findOne({_id: postId, user: userId})
    if (!post) throw new NotFoundException('Post cannot be updated!')
    if (image) {
      this.fileService.removeFile(post.image)
      image = await this.fileService.saveFile(image, 'images')
    }
    await this.postModel.updateOne(
      {_id: postId},
      {
        content: dto.content,
        image: typeof image !== 'undefined' ? image : post.image
      }
    )
    return this.getPostById(postId)
  }

  async deletePost(userId: Types.ObjectId, postId: Types.ObjectId) {
    const user = await this.userModel.findById(userId)
    const post = await this.postModel.findOne({_id: postId, user: userId})
    if (!post) throw new NotFoundException('Post cannot be deleted!')
    await this.postModel.deleteOne({_id: postId})
    user.posts = user.posts.filter((postFind) => String(postFind) !== String(post._id))
    await user.save()
    if (post.image) {
      await this.fileService.removeFile(post.image)
    }
    return {'success': true, 'message': `Post with Id "${postId}" has been deleted!`}
  }
}
