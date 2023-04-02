import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {Comment, CommentDocument} from "./comment.model";
import {CommentDto} from "./dto/comment.dto";
import {UserService} from "../user/user.service";
import {PostService} from "../post/post.service";
import {User, UserDocument} from "../user/user.model";
import {Post, PostDocument} from "../post/post.model";

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly userService: UserService,
    private readonly postService: PostService
  ) {}

  async createComment(userId: Types.ObjectId, dto: CommentDto) {
    const user = await this.userService.getUserById(userId)
    const post = await this.postService.getPostById(new Types.ObjectId(dto.postId))
    const comment = await this.commentModel.create({
      comment: dto.comment,
      post: post._id,
      user: user._id
    })
    user.comments.push(comment.id)
    await user.save()
    post.comments.push(comment.id)
    await post.save()
    return comment
  }

  async getAllComments() {
    const comments = await this.commentModel.find()
      .sort({createdAt: 'asc'})
      .populate([
        {
          path: 'post',
          populate: {path: 'user', select: '_id username avatarPath'}
        },
        {path: 'user', select: '_id username avatarPath'}
      ])
    return comments
  }

  async getCommentsByPostId(postId: Types.ObjectId) {
    const comments = await this.commentModel.find({post: postId}, '-__v')
      .sort({createdAt: 'asc'})
      .populate([
        {
          path: 'post',
          populate: {path: 'user', select: '_id username avatarPath'}
        },
        {path: 'user', select: '_id username avatarPath'}
      ])
    return comments
  }

  async getCommentById(commentId: Types.ObjectId) {
    const comment = await this.commentModel.findById({_id: commentId})
      .populate([
        {
          path: 'post',
          populate: {path: 'user', select: '_id username avatarPath'}
        },
        {path: 'user', select: '_id username avatarPath'}
      ])
    if (!comment) throw new NotFoundException('Comment was not found!')
    return comment
  }

  async updateComment(userId: Types.ObjectId, commentId: Types.ObjectId, dto: CommentDto) {
    const comment = await this.commentModel.findOne({_id: commentId, user: userId})
    if (!comment) throw new NotFoundException('Comment cannot be updated!')
    await this.commentModel.updateOne({_id: commentId},{comment: dto.comment})
    return this.getCommentById(commentId)
  }

  async deleteComment(userId: Types.ObjectId, commentId: Types.ObjectId, postId: Types.ObjectId) {
    const user = await this.userModel.findById(userId)
    const comment = await this.commentModel.findOne({_id: commentId, user: userId})
    if (!comment) throw new NotFoundException('Comment cannot be deleted!')
    const post = await this.postModel.findById(postId)
    user.comments = user.comments.filter((commentFind) => String(commentFind) !== String(comment._id))
    await user.save()
    post.comments = post.comments.filter((commentFind) => String(commentFind) !== String(comment._id))
    await post.save()
    await this.commentModel.deleteOne({_id: commentId})
    return {'success': true, 'message': `Comment with Id "${commentId}" has been deleted!`}
  }
}
