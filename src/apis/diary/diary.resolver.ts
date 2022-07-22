import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DiaryService } from './diary.service';
import { Diary } from './entities/diary.entity';
import { CreateDiaryInput } from './dto/create-diary.input';
import { UpdateDiaryInput } from './dto/update-diary.input';
import { DeleteDiaryInput } from './dto/delete-diary.input';

@Resolver(() => Diary)
export class DiaryResolver {
  constructor(private readonly diaryService: DiaryService) {}

  @Query(() => Diary)
  fetchDiary(
    //
    @Args('id') id: string,
  ) {
    return this.diaryService.findOne({ id });
  }

  @Query(() => [Diary])
  fetchAllDiaries(
    //
    @Args('room') room: string,
  ) {
    return this.diaryService.findAll({ room });
  }

  @Mutation(() => Diary)
  createDiary(
    //
    @Args('createDiaryInput') createDiaryInput: CreateDiaryInput,
  ) {
    return this.diaryService.create({ createDiaryInput });
  }

  @Mutation(() => Diary)
  updateDiary(
    //
    @Args('updateDiaryInput') updateDiaryInput: UpdateDiaryInput,
  ) {
    return this.diaryService.update({ updateDiaryInput });
  }

  @Mutation(() => Boolean)
  deleteDiary(@Args('deleteDiaryInput') deleteDiaryInput: DeleteDiaryInput) {
    return this.diaryService.remove({ deleteDiaryInput });
  }
}
