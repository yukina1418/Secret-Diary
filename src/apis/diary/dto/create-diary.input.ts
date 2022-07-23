import { Field, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class CreateDiaryInput {
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
  title: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  contents: string;

  // @Field(() => String, { nullable: true })
  // image: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  room: string;
}
