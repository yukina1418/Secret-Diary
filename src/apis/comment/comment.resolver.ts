import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => Comment, { nullable: true })
  createComment(
    //
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ): Promise<Comment> {
    return this.commentService.create(createCommentInput);
  }

  @Query(() => [Comment], { nullable: true })
  fetchComments(
    //
    @Args('diary') diary: string,
  ): Promise<Comment[]> {
    return this.commentService.findAll(diary);
  }

  @Mutation(() => Comment, { nullable: true })
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ): Promise<Comment> {
    return this.commentService.update(updateCommentInput);
  }

  // @Mutation(() => Comment)
  // deleteComment(@Args('id', { type: () => Int }) id: number) {
  //   return this.commentService.delete(id);
  // }
}
