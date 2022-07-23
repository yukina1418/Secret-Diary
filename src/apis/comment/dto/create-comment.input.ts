import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @IsString()
  @Field(() => String)
  readonly room: string;

  @IsString()
  @Field(() => String)
  readonly diary: string;

  @IsString()
  @Field(() => String)
  readonly account: string;

  @IsString()
  @Field(() => String)
  readonly password: string;

  @IsString()
  @Field(() => String)
  readonly contents: string;
}
