import { Injectable } from '@nestjs/common';
import { CreateDiaryLikeInput } from './dto/create-diary-like.input';
import { UpdateDiaryLikeInput } from './dto/update-diary-like.input';

@Injectable()
export class DiaryLikeService {
  create(createDiaryLikeInput: CreateDiaryLikeInput) {
    return 'This action adds a new diaryLike';
  }

  findAll() {
    return `This action returns all diaryLike`;
  }

  findOne(id: number) {
    return `This action returns a #${id} diaryLike`;
  }

  update(id: number, updateDiaryLikeInput: UpdateDiaryLikeInput) {
    return `This action updates a #${id} diaryLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} diaryLike`;
  }
}
