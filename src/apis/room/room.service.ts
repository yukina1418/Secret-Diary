import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { random } from 'src/commons/utilities/random';

import { Room } from './entities/room.entity';
import { CreateRoomInput } from './dto/create-room.intput';
import { UpdateRoomInput } from './dto/update-room.input';
import { AdminRoomInput } from './dto/admin-room.input';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // 에러핸들링 고민해보기, 실배포까지 갈꺼니까 더 고민하기

  async count() {
    return await this.roomRepository.count();
  }

  // 룸 참가 메소드
  async joinRoom(joinCode: string, password: string): Promise<string> {
    try {
      // 검증단
      const result: string = await this.cacheManager.get(joinCode);
      if (!result)
        throw new UnauthorizedException(
          '초대코드가 존재하지 않거나 만료되었습니다.',
        );

      const isRoom = await this.isRoomCheck(result, password, '');

      return isRoom.id;
      // 여기에 토큰정보 주는 로직 추가해야함!
    } catch (e) {
      if (e.status === 401) {
        throw e;
      }
      throw new Error('Join Room Server Error');
    }
  }

  // 룸 생성 메소드
  async create(createRoomInput: CreateRoomInput): Promise<Room> {
    const { name, password, adminPassword } = createRoomInput;
    try {
      if (password === adminPassword) {
        throw new BadRequestException(
          '관리자 비밀번호와 룸 비밀번호가 동일합니다.',
        );
      }
      return await this.roomRepository.save({
        name,
        password: bcrypt.hashSync(password, 10),
        adminPassword: bcrypt.hashSync(adminPassword, 10),
      });
    } catch (e) {
      if (e.status === 400) {
        return e;
      }
      throw new Error('Room Create Server Error');
    }
  }

  // 초대코드 생성 메소드
  async createJoinCode(adminRoomInput: AdminRoomInput): Promise<string> {
    const { id, adminPassword } = adminRoomInput;

    // 검증단
    const isRoom = await this.isRoomCheck(id, '', adminPassword);

    let uuid: string;

    // 8자리 난수 생성기
    uuid = random();
    const isCode = await this.cacheManager.get(uuid);
    try {
      //혹시나 중복 있을 수도 있으니 체크 있으면 새로 만들어
      if (isCode) uuid = random();
      await this.cacheManager.set(uuid, isRoom.id, { ttl: 302400 });

      return uuid;
    } catch (e) {
      if (e.status === 401) {
        return e;
      }
      throw new Error('RoomCode Create Server Error');
    }
  }

  // 룸 업데이트 메소드
  async update(
    adminRoomInput: AdminRoomInput,
    updateRoomInput: UpdateRoomInput,
  ): Promise<Room | boolean> {
    const { id, adminPassword } = adminRoomInput;
    const { changePassword, changeAdminPassword, ...data } = updateRoomInput;

    const isRoom = await this.isRoomCheck(id, '', adminPassword);

    try {
      if (changePassword)
        data['password'] = bcrypt.hashSync(changePassword, 10);
      if (changeAdminPassword)
        data['adminPassword'] = bcrypt.hashSync(changeAdminPassword, 10);

      return await this.roomRepository.save({
        ...isRoom,
        ...data,
      });
    } catch (e) {
      throw new Error('Room Update Server Error');
    }
  }

  // 룸 삭제 메소드
  async delete(adminRoomInput: AdminRoomInput): Promise<boolean> {
    const { id, adminPassword } = adminRoomInput;

    const isRoom = this.isRoomCheck(id, '', adminPassword);

    if (isRoom) {
      await this.roomRepository.softDelete(id);
      return true;
    } else {
      return false;
    }
  }

  // 룸 여부 검증 및 접근 권한 여부 확인 메소드
  async isRoomCheck(
    id: string,
    password?: string,
    adminPassword?: string,
  ): Promise<Room> {
    const isRoom = await this.roomRepository.findOne({
      where: { id },
    });

    try {
      if (isRoom === undefined)
        throw new NotFoundException('룸이 존재하지 않습니다.');

      if (adminPassword !== '') {
        const isPassword = bcrypt.compareSync(
          adminPassword,
          isRoom.adminPassword,
        );

        if (isPassword) return isRoom;
        throw new UnauthorizedException('관리자 비밀번호가 틀립니다.');
      }

      if (password !== '') {
        const isPassword = bcrypt.compareSync(password, isRoom.password);

        if (isPassword) return isRoom;
        throw new UnauthorizedException('비밀번호가 틀립니다.');
      }
    } catch (e) {
      if (e.status === 404 || e.status === 401) {
        throw e;
      }
      throw new Error('Room Check Server Error');
    }
  }
}

// 관리자 검증 메소드
// async isAdmin(id: string, adminPassword: string): Promise<boolean> {
//   const isRoom = await this.roomRepository.findOne({ where: { id } });
//   const isPassword = bcrypt.compareSync(adminPassword, isRoom.adminPassword);
//   return isPassword;
// }
