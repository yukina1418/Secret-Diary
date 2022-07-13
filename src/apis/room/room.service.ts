import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import * as bcrypt from 'bcrypt';
import { random } from 'src/commons/utilities/random';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // 에러핸들링 고민해보기, 실배포까지 갈꺼니까 더 고민하기

  // 룸 참가
  async joinRoom({ joinCode, password }) {
    try {
      // 검증단
      const result = await this.cacheManager.get(joinCode);
      if (!result)
        throw new UnauthorizedException(
          '초대코드가 존재하지 않거나 만료되었습니다.',
        );

      const isRoom = await this.roomRepository.findOne(result);
      const isPassword = bcrypt.compareSync(password, isRoom.password);

      if (!isPassword)
        throw new UnauthorizedException(
          '해당 룸 비밀번호와 일치하지 않습니다.',
        );

      return isRoom.id;
    } catch (e) {
      // 에러를 어떻게 예쁘게 처리하지
      throw new Error('Room Join Syntax Error');
    }
  }

  // 룸 생성
  async create({ createRoomInput }) {
    const { name, password, adminPassword } = createRoomInput;

    // 저장
    return await this.roomRepository.save({
      name,
      password: bcrypt.hashSync(password, 10),
      adminPassword: bcrypt.hashSync(adminPassword, 10),
    });
  }

  // 초대코드 생성
  async createJoinCode({ adminRoomInput }) {
    const { url, adminPassword } = adminRoomInput;
    try {
      // 검증단
      const isRoom = await this.roomRepository.findOne({ where: { url } });
      const isPassword = bcrypt.compareSync(
        adminPassword,
        isRoom.adminPassword,
      );
      if (!isPassword)
        throw new UnauthorizedException(
          '룸이 존재하지 않거나, 관리자 비밀번호가 틀립니다.',
        );

      // 8자리 난수 생성기
      const uuid = random();
      await this.cacheManager.set(uuid, isRoom.id, { ttl: 302400 });

      return uuid;
    } catch (e) {
      throw new Error('RoomCode Create Syntax Error');
    }
  }

  // 룸 업데이트
  async update({ adminRoomInput, updateRoomInput }) {
    const { name, password, adminPassword, image } = updateRoomInput;

    const isRoom = await this.roomRepository.findOne({
      where: { id: adminRoomInput.url },
    });
    const isPassword = bcrypt.compareSync(
      adminRoomInput.adminPassword,
      isRoom.adminPassword,
    );

    if (isPassword) {
      // 특정 값이 들어오지 않을 경우 어떻게 해야하는지 에러핸들링 확인해보기
      await this.roomRepository.save({
        ...isRoom,
        name,
        password: bcrypt?.hashSync(password, 10),
        adminPassword: bcrypt?.hashSync(adminPassword, 10),
        image,
      });
      return true;
    } else {
      return false;
    }
  }

  // 룸 삭제
  async delete({ adminRoomInput }) {
    const { url, adminPassword } = adminRoomInput;
    const isPassword = this.isAdmin({ url, adminPassword });
    if (isPassword) {
      await this.roomRepository.softDelete(url);
      return true;
    } else {
      return false;
    }
  }

  async isAdmin({ url, adminPassword }) {
    const isRoom = await this.roomRepository.findOne({ where: { id: url } });
    const isPassword = bcrypt.compareSync(adminPassword, isRoom.adminPassword);
    return isPassword;
  }
}
