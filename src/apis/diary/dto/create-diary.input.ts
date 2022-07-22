import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDiaryInput {
  @Field(() => String)
  account: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  // @Field(() => String, { nullable: true })
  // image: string;

  @Field(() => String)
  room: string;
}
