import { ICommand } from '@nestjs/cqrs';

export class CreateCommentCommand implements ICommand {
  constructor(
    public readonly postId: number,
    public readonly content: string,
    public readonly authorId: number,
  ) {}
}
