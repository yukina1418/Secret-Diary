import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Room } from "../entities/room.entity";
import { Repository } from "typeorm";
import { RoomService } from "../room.service";
import { random } from "../../../commons/utilities/random";
import {
  ConflictException,
  UnprocessableEntityException,
} from "@nestjs/common";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
});

describe("RoomService", () => {
  let roomService: RoomService;
  let roomRepository: MockRepository<Room>;

  beforeEach(async () => {
    const modules: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: getRepositoryToken(Room),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    roomService = modules.get<RoomService>(RoomService);
    roomRepository = modules.get(getRepositoryToken(Room));
  });
  it("Define QnAServiceTest", () => {
    expect(roomService).toBeDefined();
    expect(roomRepository).toBeDefined();
  });

  describe("QnAService - create", () => {
    it("create - url does not exist", async () => {
      const roomRepositorySpyFindOne = jest.spyOn(roomRepository, "findOne");
      roomRepository.findOne.mockResolvedValue("");
      try {
        await roomRepository.findOne({ where: { url: "url.com" } });
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
      }
      expect(roomRepositorySpyFindOne).toBeCalledTimes(1);
    });
    it("create - save failed", async () => {
      const roomRepositorySpySave = jest.spyOn(roomRepository, "save");
      roomRepository.save.mockResolvedValue("");
      try {
        await roomRepository.findOne({ where: { url: "url.com" } });
      } catch (err) {
        expect(err).toBeInstanceOf(UnprocessableEntityException);
      }
      expect(roomRepositorySpySave).toBeCalledTimes(0);
    });
  });
});
