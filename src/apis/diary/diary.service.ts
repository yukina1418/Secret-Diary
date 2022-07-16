import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Room } from '../room/entities/room.entity';
import { CreateDiaryInput } from './dto/create-diary.input';
import { UpdateDiaryInput } from './dto/update-diary.input';
import { Diary } from './entities/diary.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}
  async create(createDiaryInput: CreateDiaryInput) {
    try {
      const { password, room, ...data } = createDiaryInput;

      const roomData = await getConnection()
        .createQueryBuilder()
        .select('room')
        .from(Room, 'room')
        .where('room.id = :id', { id: room })
        .getOne();

      if (!roomData) throw new Error('Room Not Found');

      const diary = this.diaryRepository.save({
        ...data,
        room: roomData,
        password: bcrypt.hashSync(password, 10),
      });

      return diary;
    } catch (e) {
      throw new Error('Diary Create Syntax Error');
    }
  }

  async findAll({ room }) {
    const diariesData = await getConnection()
      .createQueryBuilder()
      .select('diary')
      .from(Diary, 'diary')
      .where({ room })
      .getMany();

    if (diariesData.length === 0) throw new Error('Diary Not Found');

    return diariesData;
  }

  async findOne({ id }) {
    const diaryData = await getConnection()
      .createQueryBuilder()
      .select('diary')
      .from(Diary, 'diary')
      .where({ id })
      .getOne();

    if (!diaryData) throw new Error('Diary Not Found');

    return diaryData;
  }

  update(updateDiaryInput) {
    return;
  }

  remove(id: number) {
    return `This action removes a #${id} diary`;
  }
}
