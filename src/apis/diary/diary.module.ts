import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryResolver } from './diary.resolver';

@Module({
  providers: [DiaryResolver, DiaryService],
})
export class DiaryModule {}
