import { CreateDiaryInput } from './create-diary.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDiaryInput extends PartialType(CreateDiaryInput) {
  @Field(() => String)
  room: string;

  @Field(() => String)
  id: string;

  @Field(() => String)
  password: string;
}
