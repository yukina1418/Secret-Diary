import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { RoomService } from "./room.service";
import { Room } from "./entities/room.entity";
import { CreateRoomInput } from "./dto/create-room.input";
import { UpdateRoomInput } from "./dto/update-room.input";

@Resolver(() => Room)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}
}
