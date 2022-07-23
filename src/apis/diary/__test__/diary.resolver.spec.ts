import { Test, TestingModule } from '@nestjs/testing';
import { DiaryResolver } from '../diary.resolver';
import { DiaryService } from '../diary.service';

describe('DiaryResolver', () => {
  let resolver: DiaryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiaryResolver, DiaryService],
    }).compile();

    resolver = module.get<DiaryResolver>(DiaryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
