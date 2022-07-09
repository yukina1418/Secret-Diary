import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DiaryService } from './diary.service';
import { Diary } from './entities/diary.entity';
import { CreateDiaryInput } from './dto/create-diary.input';
import { UpdateDiaryInput } from './dto/update-diary.input';

@Resolver(() => Diary)
export class DiaryResolver {
  constructor(private readonly diaryService: DiaryService) {}

  @Mutation(() => Diary)
  createDiary(@Args('createDiaryInput') createDiaryInput: CreateDiaryInput) {
    return this.diaryService.create(createDiaryInput);
  }

  @Query(() => [Diary], { name: 'diary' })
  findAll() {
    return this.diaryService.findAll();
  }

  @Query(() => Diary, { name: 'diary' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.diaryService.findOne(id);
  }

  @Mutation(() => Diary)
  updateDiary(@Args('updateDiaryInput') updateDiaryInput: UpdateDiaryInput) {
    return this.diaryService.update(updateDiaryInput.id, updateDiaryInput);
  }

  @Mutation(() => Diary)
  removeDiary(@Args('id', { type: () => Int }) id: number) {
    return this.diaryService.remove(id);
  }
}
