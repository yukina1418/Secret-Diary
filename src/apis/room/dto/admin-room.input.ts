import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AdminRoomInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  adminPassword: string;
}
