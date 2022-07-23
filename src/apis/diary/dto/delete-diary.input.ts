import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DeleteDiaryInput {
  @Field(() => String)
  room: string;

  @Field(() => String)
  id: string;

  @Field(() => String)
  password: string;
}
