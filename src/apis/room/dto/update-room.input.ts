import { CreateRoomInput } from './create-room.intput';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRoomInput extends PartialType(CreateRoomInput) {
  @Field(() => String, { nullable: true })
  image: string;
}
