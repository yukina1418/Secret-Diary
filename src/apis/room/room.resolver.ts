import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { RoomService } from './room.service';
import { Room } from './entities/room.entity';
import { CreateRoomInput } from './dto/create-room.intput';
import { UpdateRoomInput } from './dto/update-room.input';
import { AdminRoomInput } from './dto/admin-room.input';

@Resolver(() => Room)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Mutation(() => String)
  joinRoom(
    //
    @Args('joinCode') joinCode: string,
    @Args('password') password: string,
  ) {
    return this.roomService.joinRoom({ joinCode, password });
  }

  @Mutation(() => Room)
  createRoom(
    //
    @Args('createRoomInput') createRoomInput: CreateRoomInput,
  ) {
    return this.roomService.create({ createRoomInput });
  }

  @Mutation(() => String)
  createRoomJoinCode(
    //
    @Args('adminRoomInput') adminRoomInput: AdminRoomInput,
  ) {
    return this.roomService.createJoinCode({ adminRoomInput });
  }

  @Mutation(() => Room)
  updateRoom(
    @Args('adminRoomInput') adminRoomInput: AdminRoomInput,
    @Args('updateRoomInput') updateRoomInput: UpdateRoomInput,
  ) {
    return this.roomService.update({ adminRoomInput, updateRoomInput });
  }

  @Mutation(() => Boolean)
  deleteRoom(
    //
    @Args('adminRoomInput') adminRoomInput: AdminRoomInput,
  ) {
    return this.roomService.delete({ adminRoomInput });
  }
}
