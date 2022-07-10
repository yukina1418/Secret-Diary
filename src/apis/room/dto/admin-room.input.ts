import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class AdminRoomInput {
  @Field(() => String)
  url: string;

  @Field(() => String)
  adminPassword: string;
}
