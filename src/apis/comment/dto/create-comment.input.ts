import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  room: string;

  @Field(() => String)
  diary: string;

  @Field(() => String)
  account: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  contents: string;
}
