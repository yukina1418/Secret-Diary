import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  room: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  diary: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  account: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  contents: string;
}
