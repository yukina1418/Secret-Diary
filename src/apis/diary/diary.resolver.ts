import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DiaryService } from './diary.service';
import { Diary } from './entities/diary.entity';
import { CreateDiaryInput } from './dto/create-diary.input';
import { UpdateDiaryInput } from './dto/update-diary.input';
import { DeleteDiaryInput } from './dto/delete-diary.input';

@Resolver()
export class DiaryResolver {
  constructor(private readonly diaryService: DiaryService) {}

  @Query(() => Diary, { nullable: true })
  fetchDiary(@Args('id') id: string): Promise<Diary> {
    return this.diaryService.findOne(id);
  }

  @Query(() => [Diary], { nullable: true })
  fetchDiaries(@Args('room') room: string): Promise<Diary[]> {
    return this.diaryService.findAll(room);
  }

  @Mutation(() => Diary, { nullable: true })
  createDiary(@Args() createDiaryInput: CreateDiaryInput): Promise<Diary> {
    return this.diaryService.create(createDiaryInput);
  }

  @Mutation(() => Diary, { nullable: true })
  updateDiary(@Args() updateDiaryInput: UpdateDiaryInput): Promise<Diary> {
    return this.diaryService.update(updateDiaryInput);
  }

  @Mutation(() => Boolean, { nullable: true })
  deleteDiary(@Args() deleteDiaryInput: DeleteDiaryInput): Promise<boolean> {
    return this.diaryService.delete(deleteDiaryInput);
  }
}
