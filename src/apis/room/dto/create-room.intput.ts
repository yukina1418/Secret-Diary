import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateRoomInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  adminPassword: string;
}
