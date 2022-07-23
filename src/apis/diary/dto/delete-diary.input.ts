import { Field, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class DeleteDiaryInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  room: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  id: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  password: string;
}
