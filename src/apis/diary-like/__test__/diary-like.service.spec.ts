import { Test, TestingModule } from "@nestjs/testing";
import { DiaryLikeService } from "../diary-like.service";

describe("DiaryLikeService", () => {
  let service: DiaryLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiaryLikeService],
    }).compile();

    service = module.get<DiaryLikeService>(DiaryLikeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
