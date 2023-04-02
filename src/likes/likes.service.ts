import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {Like, LikeDocument} from "./likes.model";
import {User, UserDocument} from "../user/user.model";
import {Post, PostDocument} from "../post/post.model";
import {UserService} from "../user/user.service";
import {PostService} from "../post/post.service";

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private readonly likeModel: Model<LikeDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly userService: UserService,
    private readonly postService: PostService
  ) {}

  async checkExistsLike(userId: Types.ObjectId, postId: Types.ObjectId) {
    return this.likeModel.exists({post: postId, user: userId})
      .exec()
      .then((data) => !!data)
  }

  async addOrRemoveLike(userId: Types.ObjectId, postId: Types.ObjectId) {
    const isExistsLike = await this.checkExistsLike(userId, postId)
    const user = await this.userModel.findById(userId)
    const post = await this.postModel.findById(postId)
    if (isExistsLike) {
      const like = await this.likeModel.findOne({post: postId, user: userId})
      user.likes = user.likes.filter((likeFind) => String(likeFind) !== String(like._id))
      await user.save()
      post.likes = post.likes.filter((likeFind) => String(likeFind) !== String(like._id))
      await post.save()
      await this.likeModel.deleteOne({post: postId, user: userId})
      return {'success': true, 'message': `Like has been deleted!`}
    }
    const like = await this.likeModel.create({post: postId, user: userId})
    user.likes.push(like.id)
    await user.save()
    post.likes.push(like.id)
    await post.save()
    return like
  }

  getPostLikesCount(postId: Types.ObjectId) {
    return this.likeModel.find({post: postId}).count().exec()
  }

  async getAllLikes() {
    const likes = await this.likeModel.find()
      .sort({createdAt: 'desc'})
      .populate([
        {
          path: 'post',
          populate: {path: 'user', select: '_id username avatarPath'}
        },
        {path: 'user', select: '_id username avatarPath'}
      ])
    return likes
  }

  async getLikesByPostId(postId: Types.ObjectId) {
    const likes = await this.likeModel.find({post: postId}, '-__v')
      .sort({createdAt: 'desc'})
      .populate([
        {
          path: 'post',
          populate: {path: 'user', select: '_id username avatarPath'}
        },
        {path: 'user', select: '_id username avatarPath'}
      ])
    return likes
  }

  async getLikeById(likeId: Types.ObjectId) {
    const like = await this.likeModel.findById({_id: likeId})
      .populate([
        {
          path: 'post',
          populate: {path: 'user', select: '_id username avatarPath'}
        },
        {path: 'user', select: '_id username avatarPath'}
      ])
    if (!like) throw new NotFoundException('Like was not found!')
    return like
  }
}
