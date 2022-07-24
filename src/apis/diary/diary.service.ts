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

  // 다이어리 생성 API//////////////////////////////
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
      if (!roomData) throw new BadRequestException('방이 존재하지 않습니다.');

      // 있으면 룸 정보를 FK로 저장
      return await this.diaryRepository.save({
        ...data,
        room: roomData,
        password: bcrypt.hashSync(password, 10),
      });
    } catch (e) {
      if (e.status === 400) {
        return e;
      }
      // 400 에러가 아니면 서버 에러
      throw new Error('Diary Create Server Error');
    }
  }

  // 룸에 관련된 다이어리를 전부 다 가져오는 API//////////////////////////////
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
      throw new BadRequestException('다이어리가 존재하지 않습니다.');

    return diariesData;
  }

  // 다이어리 한 개만 찾아오는 API//////////////////////////////
  async findOne(id: string): Promise<Diary> {
    const diaryData = await getConnection()
      .createQueryBuilder()
      .select('diary')
      .from(Diary, 'diary')
      .where({ id })
      .getOne();

    // 다이어리가 없으면 400 에러
    if (diaryData === undefined)
      throw new BadRequestException('다이어리가 존재하지 않습니다.');

    return diaryData;
  }

  // 다이어리 업데이트 API//////////////////////////////
  async update(updateDiaryInput: UpdateDiaryInput): Promise<Diary> {
    const { id, password, room, ...data } = updateDiaryInput;

    // 다이어리 정보 검증
    const diaryData = await getConnection()
      .createQueryBuilder()
      .select('diary')
      .from(Diary, 'diary')
      .leftJoinAndSelect('diary.room', 'room')
      .where({ id })
      .andWhere({ room })
      .getOne();

    try {
      // 다이어리가 없으면 400에러
      if (diaryData === undefined)
        throw new BadRequestException('다이어리가 존재하지 않습니다.');

      const isPassword = bcrypt.compareSync(password, diaryData.password);

      // 비밀번호가 틀리면 401에러
      if (!isPassword)
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

      return await this.diaryRepository.save({
        ...diaryData,
        ...data,
      });
    } catch (e) {
      if (e.status === 400 || e.status === 401) {
        return e;
      }
      // 둘 다 아니면 서버 에러
      throw new Error('Diary Update Server Error');
    }
  }

  // 다이어리 삭제 API///////
  async delete(deleteDiaryInput: DeleteDiaryInput): Promise<boolean> {
    const { id, password, room } = deleteDiaryInput;

    // 1+n 문제를 막기 위한 relations 옵션으로 찾아오기
    const diaryData = await this.diaryRepository.findOne({
      where: { id, room },
      relations: ['room'],
    });

    try {
      // 다이어리가 없으면 400에러
      if (diaryData === undefined)
        throw new BadRequestException('다이어리가 존재하지 않습니다.');

      const isPassword = bcrypt.compareSync(password, diaryData.password);

      // 비밀번호가 틀리면 401에러
      if (!isPassword)
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

      await this.diaryRepository.softDelete(diaryData);
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
