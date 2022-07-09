import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Room } from "./entities/room.entity";
import * as bcrypt from "bcrypt";
import { random } from "src/commons/utilities/random";

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  // 룸 참가
  async joinRoom({ joinCode, password }) {
    try {
      const result = await this.cacheManager.get(joinCode);
      const isRoom = await this.roomRepository.findOne(result);
      const isPassword = bcrypt.compareSync(password, isRoom.password);

      if (isPassword) return isRoom.id;
    } catch (e) {
      // 에러를 어떻게 예쁘게 처리하지
      throw new UnauthorizedException(
        "초대코드가 존재하지 않거나 만료되었습니다."
      );
    }
  }

  // 룸 생성
  async create({ createRoomInput }) {
    const { name, password, adminPassword } = createRoomInput;

    return await this.roomRepository.save({
      name,
      password: bcrypt.hashSync(password, 10),
      adminPassword: bcrypt.hashSync(adminPassword, 10),
    });
  }

  // 초대코드 생성
  async createJoinCode({ name, adminPassword }) {
    try {
      const isRoom = await this.roomRepository.findOne({ where: { name } });
      const isPassword = bcrypt.compareSync(
        adminPassword,
        isRoom.adminPassword
      );
      if (!isPassword) alert("비밀번호 불일치");

      // 8자리 난수 생성기
      const uuid = random();
      await this.cacheManager.set(uuid, isRoom.id, { ttl: 604800 });

      return uuid;
    } catch (e) {
      // 에러날 구석은 모두 검증단이니 검증 에러로 처리
      throw new UnauthorizedException(
        "룸이 존재하지 않거나, 관리자 비밀번호가 틀립니다."
      );
    }
  }
}
