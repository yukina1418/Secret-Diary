import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Diary } from '../diary/entities/diary.entity';
import { CreateDiaryLikeCommand } from './command/create-diary-like.command';
import { DiaryLike } from './entities/diary-like.entity';

@Injectable()
@CommandHandler(CreateDiaryLikeCommand)
export class CreateDiaryLikeCommandHandler
  implements ICommandHandler<CreateDiaryLikeCommand>
{
  constructor(
    @InjectRepository(DiaryLike)
    private readonly diaryLikeRepository: Repository<DiaryLike>,
  ) {}

  async execute(command: CreateDiaryLikeCommand) {
    const { data, diary } = command;

    const diaryData = await getConnection()
      .createQueryBuilder()
      .select('diary')
      .from(Diary, 'diary')
      .where('diary.id = :id', { id: diary })
      .getOne();

    try {
      if (!diaryData)
        throw new NotFoundException('다이어리가 존재하지 않습니다.');

      // 좋아요 눌렀는지 확인하기
      const alreadyLiked = await this.diaryLikeRepository.findOne({
        where: { fkDiaryId: diary, data },
      });

      if (alreadyLiked) {
        // 좋아요 기록 삭제
        await this.diaryLikeRepository.delete({ id: alreadyLiked.id });

        // 좋아요 카운트 -1
        await getConnection()
          .createQueryBuilder()
          .update(Diary)
          .set({ likeCount: () => `likeCount-1` })
          .where('id = :id', { id: diary })
          .execute();

        // 다이어리 정보 리턴
        return diaryData;
      }

      // 좋아요 기록 생성
      await this.diaryLikeRepository.save({
        fkDiaryId: diary,
        data,
      });

      // 다이어리 좋아요 +1
      await getConnection()
        .createQueryBuilder()
        .update(Diary)
        .set({ likeCount: () => `likeCount+1` })
        .where('id = :id', { id: diary })
        .execute();

      // 다이어리 정보 리턴
      return diaryData;
    } catch (e) {
      if (e.status === 404) {
        return e;
      }
      throw new Error('Diary Like Create Server Error');
    }
  }
}
