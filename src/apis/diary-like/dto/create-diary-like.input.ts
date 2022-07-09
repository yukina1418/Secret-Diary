import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateDiaryLikeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
