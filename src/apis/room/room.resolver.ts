import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { RoomService } from './room.service';
import { Room } from './entities/room.entity';
import { CreateRoomInput } from './dto/create-room.intput';
import { UpdateRoomInput } from './dto/update-room.input';
import { AdminRoomInput } from './dto/admin-room.input';

@Resolver(() => Room)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Query(() => Int)
  fetchRoomCount() {
    return this.roomService.count();
  }

  @Mutation(() => String, { nullable: true })
  joinRoom(
    //
    @Args('joinCode') joinCode: string,
    @Args('password') password: string,
  ): Promise<string> {
    return this.roomService.joinRoom(joinCode, password);
  }

  @Mutation(() => Room, { nullable: true })
  createRoom(
    //
    @Args('createRoomInput') createRoomInput: CreateRoomInput,
  ): Promise<Room> {
    return this.roomService.create(createRoomInput);
  }

  @Mutation(() => String, { nullable: true })
  createRoomJoinCode(
    //
    @Args('adminRoomInput') adminRoomInput: AdminRoomInput,
  ): Promise<string> {
    return this.roomService.createJoinCode(adminRoomInput);
  }

  @Mutation(() => Room || Boolean, { nullable: true })
  updateRoom(
    @Args('adminRoomInput') adminRoomInput: AdminRoomInput,
    @Args('updateRoomInput') updateRoomInput: UpdateRoomInput,
  ): Promise<Room | boolean> {
    return this.roomService.update(adminRoomInput, updateRoomInput);
  }

  @Mutation(() => Boolean, { nullable: true })
  deleteRoom(
    @Args('adminRoomInput') adminRoomInput: AdminRoomInput,
  ): Promise<boolean> {
    return this.roomService.delete(adminRoomInput);
  }
}
