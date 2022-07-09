import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Diary {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
