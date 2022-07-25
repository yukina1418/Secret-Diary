import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDiaryLikeInput {
  @Field(() => String)
  data: string;

  @Field(() => String)
  diary: string;
}
