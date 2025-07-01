import { ICommand } from '@nestjs/cqrs';
import { UpdatePostDto } from '../../dto/update-post.dto';

export class UpdatePostCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdatePostDto,
    public readonly userId: number,
    public readonly isAdmin: boolean,
  ) {}
}
