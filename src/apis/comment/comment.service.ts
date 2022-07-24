import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Diary } from '../diary/entities/diary.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
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
        throw new NotFoundException('다이어리가 존재하지 않습니다.');

      // 있으면 저장하고 리턴
      return await this.commentRepository.save({
        ...data,
        diary: diaryData,
      });
    } catch (e) {
      if (e.status === 404) {
        return e;
      }
      // 그 외의 문제가 있다면 400 에러 리턴
      throw new BadRequestException('Comment Create Server Error');
    }
  }

  // 댓글 전부 불러오는 API
  async findAll(diary: string): Promise<Comment[]> {
    const commentsData = await getConnection()
      .createQueryBuilder()
      .select('comment')
      .from(Comment, 'comment')
      .where('comment.diary = :diary', { diary })
      .getMany();

    if (commentsData.length === 0)
      throw new BadRequestException('댓글이 존재하지 않습니다');

    return commentsData;
  }

  // 댓글 수정 API
  async update(updateCommentInput: UpdateCommentInput): Promise<Comment> {
    const { id, password, ...data } = updateCommentInput;

    const commentData = await getConnection()
      .createQueryBuilder()
      .select('comment')
      .from(Comment, 'comment')
      .where('comment.id = :id', { id })
      .getOne();

    try {
      if (commentData === undefined)
        throw new NotFoundException('댓글이 존재하지 않습니다.');

      const isPassword = bcrypt.compareSync(password, commentData.password);

      if (!isPassword)
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

      return await this.commentRepository.save({
        ...commentData,
        ...data,
      });
    } catch (e) {
      throw new Error('Comment Update Server Error');
    }
  }

  delete(id: string, password: string): Promise<boolean> {
    return;
  }
}
