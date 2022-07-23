import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryResolver } from './diary.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './entities/diary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Diary])],
  providers: [DiaryResolver, DiaryService],
})
export class DiaryModule {}
