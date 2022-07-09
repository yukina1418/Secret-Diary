import { CreateDiaryLikeInput } from './create-diary-like.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDiaryLikeInput extends PartialType(CreateDiaryLikeInput) {
  @Field(() => Int)
  id: number;
}
