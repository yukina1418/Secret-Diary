import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateRoomInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  changePassword: string;

  @Field(() => String, { nullable: true })
  changeAdminPassword: string;

  @Field(() => String, { nullable: true })
  image: string;
}
