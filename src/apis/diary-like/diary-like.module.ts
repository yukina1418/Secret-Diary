import { Module } from '@nestjs/common';
import { DiaryLikeService } from './diary-like.service';
import { DiaryLikeResolver } from './diary-like.resolver';

@Module({
  providers: [DiaryLikeResolver, DiaryLikeService]
})
export class DiaryLikeModule {}
