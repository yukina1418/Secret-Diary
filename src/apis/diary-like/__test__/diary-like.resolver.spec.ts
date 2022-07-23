import { Test, TestingModule } from '@nestjs/testing';
import { DiaryLikeResolver } from '../diary-like.resolver';
import { DiaryLikeService } from '../diary-like.service';

describe('DiaryLikeResolver', () => {
  let resolver: DiaryLikeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiaryLikeResolver, DiaryLikeService],
    }).compile();

    resolver = module.get<DiaryLikeResolver>(DiaryLikeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
