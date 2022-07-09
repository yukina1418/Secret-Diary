import { CreateDiaryInput } from './create-diary.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDiaryInput extends PartialType(CreateDiaryInput) {
  @Field(() => Int)
  id: number;
}
