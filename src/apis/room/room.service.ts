import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRoomInput } from "./dto/create-room.input";
import { UpdateRoomInput } from "./dto/update-room.input";
import { Room } from "./entities/room.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>
  ) {}

  async create({ name, password }) {
    return await this.roomRepository.save({
      name,
      password: bcrypt.hashSync(password, 10),
    });
  }

  // async findOne({}){
  //   return await this.roomRepository.findOne();
  // }
}
