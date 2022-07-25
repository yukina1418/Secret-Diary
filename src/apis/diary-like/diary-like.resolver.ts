import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { DiaryLikeService } from './diary-like.service';
import { CreateDiaryLikeInput } from './dto/create-diary-like.input';
import { Diary } from '../diary/entities/diary.entity';
import { CreateDiaryLikeCommand } from './command/create-diary-like.command';
import { CommandBus } from '@nestjs/cqrs';

@Resolver()
export class DiaryLikeResolver {
  constructor(
    private readonly diaryLikeService: DiaryLikeService,
    private commandBus: CommandBus,
  ) {}

  // 이게 좋은지는 좀 알아봐야할 것 같다.
  @Mutation(() => Diary)
  createDiaryLike(
    @Args('createDiaryLikeInput') createDiaryLikeInput: CreateDiaryLikeInput,
  ): Promise<Diary> {
    const { data, diary } = createDiaryLikeInput;

    const command = new CreateDiaryLikeCommand(data, diary);

    return this.commandBus.execute(command);

    //    return this.diaryLikeService.create(createDiaryLikeInput);
  }
}
