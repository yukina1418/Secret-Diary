import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DiaryLikeService } from './diary-like.service';
import { DiaryLike } from './entities/diary-like.entity';
import { CreateDiaryLikeInput } from './dto/create-diary-like.input';
import { UpdateDiaryLikeInput } from './dto/update-diary-like.input';

@Resolver(() => DiaryLike)
export class DiaryLikeResolver {
  constructor(private readonly diaryLikeService: DiaryLikeService) {}

  @Mutation(() => DiaryLike)
  createDiaryLike(@Args('createDiaryLikeInput') createDiaryLikeInput: CreateDiaryLikeInput) {
    return this.diaryLikeService.create(createDiaryLikeInput);
  }

  @Query(() => [DiaryLike], { name: 'diaryLike' })
  findAll() {
    return this.diaryLikeService.findAll();
  }

  @Query(() => DiaryLike, { name: 'diaryLike' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.diaryLikeService.findOne(id);
  }

  @Mutation(() => DiaryLike)
  updateDiaryLike(@Args('updateDiaryLikeInput') updateDiaryLikeInput: UpdateDiaryLikeInput) {
    return this.diaryLikeService.update(updateDiaryLikeInput.id, updateDiaryLikeInput);
  }

  @Mutation(() => DiaryLike)
  removeDiaryLike(@Args('id', { type: () => Int }) id: number) {
    return this.diaryLikeService.remove(id);
  }
}
