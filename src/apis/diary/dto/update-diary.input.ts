import { CreateDiaryInput } from './create-diary.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDiaryInput extends PartialType(CreateDiaryInput) {
  @Field(() => String)
  id: string;
}
