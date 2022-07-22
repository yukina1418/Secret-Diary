import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Room } from '../room/entities/room.entity';
import { Diary } from './entities/diary.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}
  async create({ createDiaryInput }) {
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

    //const diariesData = await this.diaryRepository.find({ where: { room } });

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

  async update({ updateDiaryInput }) {
    const { id, password, room, ...data } = updateDiaryInput;

    const isDiary = await getConnection()
      .createQueryBuilder()
      .select('diary')
      .from(Diary, 'diary')
      .leftJoinAndSelect('diary.room', 'room')
      .where({ id })
      .andWhere({ room })
      .getOne();

    if (!isDiary) throw new Error('Diary Id Not Found');

    const isPassword = bcrypt.compareSync(password, isDiary.password);

    if (!isPassword) throw new Error('Diary Password Not Match');

    const diaryData = await this.diaryRepository.save({ ...isDiary, ...data });

    return diaryData;
  }

  async remove({ deleteDiaryInput }) {
    const { id, password, room } = deleteDiaryInput;

    const isDiary = await this.diaryRepository.findOne({
      where: { id, room },
      relations: ['room'],
    });

    if (!isDiary) throw new Error('Diary Id Not Found');

    const isPassword = bcrypt.compareSync(password, isDiary.password);

    if (!isPassword) throw new Error('Diary Password Not Match');

    await this.diaryRepository.softDelete({ id, room });

    return true;
  }
}
