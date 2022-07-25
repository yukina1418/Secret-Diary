import { ICommand } from '@nestjs/cqrs';

export class CreateDiaryLikeCommand implements ICommand {
  constructor(readonly data: string, readonly diary: string) {}
}
