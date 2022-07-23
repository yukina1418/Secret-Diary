import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Diary } from '../diary/entities/diary.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  // 댓글 생성 API
  async create(createCommentInput: CreateCommentInput): Promise<Comment> {
    const { room, diary, ...data } = createCommentInput;

    // 다이어리 데이터 불러오기
    const diaryData = await getConnection()
      .createQueryBuilder()
      .select('diary.id')
      .from(Diary, 'diary')
      .leftJoinAndSelect('diary.room', 'room')
      .where('diary.id = :id', { id: diary })
      .andWhere('diary.room = :room', { room: room })
      .getOne();

    try {
      // 다이어리 데이터 없으면 404 에러 리턴
      if (diaryData === undefined)
        throw new NotFoundException('Diary Not Found');

      // 있으면 저장하고 리턴
      return await this.commentRepository.save({
        ...data,
        diary: diaryData,
      });
    } catch (e) {
      if (e.status === 404) {
        return e;
      }
      // 그 외의 문제가 있다면 400에러 리턴
      throw new BadRequestException('Comment Create Server Error');
    }
  }

  // 댓글 전부 불러오는 메소드
  async findAll(diary: string): Promise<Comment[]> {
    const commentsData = await getConnection()
      .createQueryBuilder()
      .select('comment')
      .from(Comment, 'comment')
      .where('comment.diary = :diary', { diary })
      .getMany();

    if (commentsData.length === 0)
      throw new BadRequestException('Comment Not Found');

    return commentsData;
  }

  delete(id: string, password: string): Promise<boolean> {
    return;
  }
}
