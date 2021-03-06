import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Room } from '../room/entities/room.entity';
import { Diary } from './entities/diary.entity';
import { CreateDiaryInput } from './dto/create-diary.input';
import { UpdateDiaryInput } from './dto/update-diary.input';
import { DeleteDiaryInput } from './dto/delete-diary.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}

  // 다이어리 생성 메소드//////////////////////////////
  async create(createDiaryInput: CreateDiaryInput): Promise<Diary> {
    const { password, room, ...data } = createDiaryInput;

    // 룸 정보 검증
    const roomData = await getConnection()
      .createQueryBuilder()
      .select('room')
      .from(Room, 'room')
      .where('room.id = :id', { id: room })
      .getOne();

    try {
      // 룸 없으면 400에러
      if (!roomData) throw new BadRequestException('Room Not Found');

      // 있으면 룸 정보를 FK로 저장
      const diary = this.diaryRepository.save({
        ...data,
        room: roomData,
        password: bcrypt.hashSync(password, 10),
      });

      return diary;
    } catch (e) {
      if (e.status === 400) {
        return e;
      }
      // 400 에러가 아니면 서버 에러
      throw new Error('Diary Create Server Error');
    }
  }

  // 룸에 관련된 다이어리를 전부 다 가져오는 메소드//////////////////////////////
  async findAll(room: string): Promise<Diary[]> {
    // 정렬해서 가져오기
    const diariesData = await getConnection()
      .createQueryBuilder()
      .select('diary')
      .from(Diary, 'diary')
      .where({ room })
      .orderBy('diary.createAt', 'DESC')
      .getMany();

    // 가져왔는데 배열이 비어있다면 400에러
    if (diariesData.length === 0)
      throw new BadRequestException('Diary Not Found');

    return diariesData;
  }

  // 다이어리 한 개만 찾아오는 메소드//////////////////////////////
  async findOne(id: string): Promise<Diary> {
    const diaryData = await getConnection()
      .createQueryBuilder()
      .select('diary')
      .from(Diary, 'diary')
      .where({ id })
      .getOne();

    // 다이어리가 없으면 400 에러
    if (diaryData === undefined)
      throw new BadRequestException('Diary Not Found');

    return diaryData;
  }

  // 다이어리 업데이트 메소드//////////////////////////////
  async update(updateDiaryInput: UpdateDiaryInput): Promise<Diary> {
    const { id, password, room, ...data } = updateDiaryInput;

    // 다이어리 정보 검증
    const isDiary = await getConnection()
      .createQueryBuilder()
      .select('diary')
      .from(Diary, 'diary')
      .leftJoinAndSelect('diary.room', 'room')
      .where({ id })
      .andWhere({ room })
      .getOne();

    try {
      // 다이어리가 없으면 400에러
      if (isDiary === undefined)
        throw new BadRequestException('Diary Id Not Found');

      const isPassword = bcrypt.compareSync(password, isDiary.password);

      // 비밀번호가 틀리면 401에러
      if (!isPassword)
        throw new UnauthorizedException('Diary Password Not Match');

      const diaryData = await this.diaryRepository.save({
        ...isDiary,
        ...data,
      });

      return diaryData;
    } catch (e) {
      if (e.status === 400 || e.status === 401) {
        return e;
      }
      // 둘 다 아니면 서버 에러
      throw new Error('Diary Update Server Error');
    }
  }

  // 다이어리 삭제 메소드///////
  async delete(deleteDiaryInput: DeleteDiaryInput): Promise<boolean> {
    const { id, password, room } = deleteDiaryInput;

    // 1+n 문제를 막기 위한 relations 옵션으로 찾아오기
    const isDiary = await this.diaryRepository.findOne({
      where: { id, room },
      relations: ['room'],
    });

    try {
      // 다이어리가 없으면 400에러
      if (isDiary === undefined)
        throw new BadRequestException('Diary Id Not Found');

      const isPassword = bcrypt.compareSync(password, isDiary.password);

      // 비밀번호가 틀리면 401에러
      if (!isPassword)
        throw new UnauthorizedException('Diary Password Not Match');

      await this.diaryRepository.softDelete(isDiary);
      return true;
    } catch (e) {
      if (e.status === 400 || e.status === 401) {
        return e;
      }
      // 둘 다 아니면 서버 에러
      throw new Error('Diary Delete Server Error');
    }
  }
}
