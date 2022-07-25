import { Module } from '@nestjs/common';
import { DiaryLikeService } from './diary-like.service';
import { DiaryLikeResolver } from './diary-like.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryLike } from './entities/diary-like.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateDiaryLikeCommandHandler } from './create-diary-like.handler';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryLike]), CqrsModule],
  providers: [
    DiaryLikeResolver,
    DiaryLikeService,
    CreateDiaryLikeCommandHandler,
  ],
})
export class DiaryLikeModule {}
