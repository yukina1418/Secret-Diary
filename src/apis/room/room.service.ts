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

  // 룸 카운트 세주는 메소드//////////////////////////////////////////////////////////////////////////////////////////////
  async count() {
    // 얘도 뭔가 더 필요한게 없을지 고민하기.
    // 메인페이지에서 현재 x개의 일기장이 생성되었습니다! 같은 것을 위한 메소드
    return await this.roomRepository.count();
  }

  // 룸 참가 메소드////////////////////////////////////////////////////////////////////////////////////////////////////
  async joinRoom(joinCode: string, password: string): Promise<string> {
    try {
      // 레디스에 생성코드 존재여부 확인
      const result: string = await this.cacheManager.get(joinCode);
      // 없으면 401 에러
      if (!result)
        throw new UnauthorizedException(
          '초대코드가 존재하지 않거나 만료되었습니다.',
        );

      // 있으면 검증로직 실행
      const isRoom = await this.isRoomCheck(result, password, '');

      return isRoom.id;
      // 여기에 JWT 토큰정보 주는 로직 추가해야함!
    } catch (e) {
      if (e.status === 401) {
        throw e;
      }
      // 401 에러 아니면 서버 에러
      throw new Error('Join Room Server Error');
    }
  }

  // 룸 생성 메소드////////////////////////////////////////////////////////////////////////////////////////////////////
  async create(createRoomInput: CreateRoomInput): Promise<Room> {
    const { name, password, adminPassword } = createRoomInput;
    try {
      // 비밀번호 두개가 동일한 것은 보안적으로 위험해서 에러 발생
      if (password === adminPassword) {
        throw new BadRequestException(
          '관리자 비밀번호와 룸 비밀번호가 동일합니다.',
        );
      }

      // bcrypt로 비밀번호 암호화
      return await this.roomRepository.save({
        name,
        password: bcrypt.hashSync(password, 10),
        adminPassword: bcrypt.hashSync(adminPassword, 10),
      });
    } catch (e) {
      if (e.status === 400) {
        return e;
      }
      // 400 에러 아니면 서버 에러
      throw new Error('Room Create Server Error');
    }
  }

  // 초대코드 생성 메소드////////////////////////////////////////////////////////////////////////////////////////////////////
  async createJoinCode(adminRoomInput: AdminRoomInput): Promise<string> {
    const { id, adminPassword } = adminRoomInput;

    // 검증 로직 실행
    const isRoom = await this.isRoomCheck(id, '', adminPassword);

    // 난수 값이 변경될 가능성이 존재해서 상수가 아닌 변수로 선언
    let uuid: string;

    // 8자리 난수 생성기
    uuid = random();
    const isCode = await this.cacheManager.get(uuid);
    try {
      //혹시나 중복 있을 수도 있으니 체크, 존재할 경우 새로 생성
      if (isCode) uuid = random();

      // 기간은 일단 일주일로 두긴 했으나, 고민 중
      await this.cacheManager.set(uuid, isRoom.id, { ttl: 302400 });

      return uuid;
    } catch (e) {
      // 검증 로직에서 자체적으로 에러를 리턴 시키기 때문에 로직상에 문제가 있을 경우 서버 에러 발생
      throw new Error('RoomCode Create Server Error');
    }
  }

  // 룸 업데이트 메소드////////////////////////////////////////////////////////////////////////////////////////////////////
  async update(
    adminRoomInput: AdminRoomInput,
    updateRoomInput: UpdateRoomInput,
  ): Promise<Room | boolean> {
    const { id, adminPassword } = adminRoomInput;
    const { changePassword, changeAdminPassword, ...data } = updateRoomInput;

    // 검증 로직 실행
    const isRoom = await this.isRoomCheck(id, '', adminPassword);

    try {
      // 비밀번호, 관리자 비밀번호를 변경할 수 있기 때문에 존재여부 확인해서 있으면 data에 추가
      if (changePassword)
        data['password'] = bcrypt.hashSync(changePassword, 10);
      if (changeAdminPassword)
        data['adminPassword'] = bcrypt.hashSync(changeAdminPassword, 10);

      //추가된 여부 확인하고 덮어쓰기
      return await this.roomRepository.save({
        ...isRoom,
        ...data,
      });
    } catch (e) {
      // 문제 있으면 400 에러
      throw new Error('Room Update Server Error');
    }
  }

  // 룸 삭제 메소드////////////////////////////////////////////////////////////////////////////////////////////////////
  async delete(adminRoomInput: AdminRoomInput): Promise<boolean> {
    const { id, adminPassword } = adminRoomInput;

    const isRoom = this.isRoomCheck(id, '', adminPassword);

    if (isRoom) {
      await this.roomRepository.softDelete(id);
      return true;
    } else {
      return false;
    }

    // 이 부분은 고도화가 필요할 것 같은데, 고민을 좀 해봐야할 것 같다.
  }

  // 룸 여부 검증 및 접근 권한 여부 확인 메소드////////////////////////////////////////////////////////////////////////////////////////////////////
  async isRoomCheck(
    id: string,
    password?: string,
    adminPassword?: string,
  ): Promise<Room> {
    // 룸 여부 검증
    const isRoom = await this.roomRepository.findOne({
      where: { id },
    });

    try {
      // 없으면 400 에러
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

    // 해당 메소드가 엄청 불편하게 이상하게 작성되어있는 것 같다.
    // 인자가 없을 경우 어떻게 해야할지 모르겠어서 애초에 입력 값에 공백을 넣어놓고
    // 해당 메소드의 조건문에서 공백이 아닐 경우로 체크를 하고 있는데, 조금 더 찾아봐야할 것 같다.
  }
}

// 관리자 검증 메소드
// async isAdmin(id: string, adminPassword: string): Promise<boolean> {
//   const isRoom = await this.roomRepository.findOne({ where: { id } });
//   const isPassword = bcrypt.compareSync(adminPassword, isRoom.adminPassword);
//   return isPassword;
// }
