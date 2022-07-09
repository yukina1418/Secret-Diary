import { Injectable } from '@nestjs/common';
import { CreateDiaryInput } from './dto/create-diary.input';
import { UpdateDiaryInput } from './dto/update-diary.input';

@Injectable()
export class DiaryService {
  create(createDiaryInput: CreateDiaryInput) {
    return 'This action adds a new diary';
  }

  findAll() {
    return `This action returns all diary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} diary`;
  }

  update(id: number, updateDiaryInput: UpdateDiaryInput) {
    return `This action updates a #${id} diary`;
  }

  remove(id: number) {
    return `This action removes a #${id} diary`;
  }
}
