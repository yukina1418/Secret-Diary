import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AdminRoomInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  id: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  adminPassword: string;
}
