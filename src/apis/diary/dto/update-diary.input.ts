import { CreateDiaryInput } from './create-diary.input';
import { Field, PartialType, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType() // <- 인풋타입이랑 뭐가 더 좋은건지 찾아봐야겠다
export class UpdateDiaryInput extends PartialType(CreateDiaryInput) {
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
