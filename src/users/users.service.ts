import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GetUserQuery } from './queries/impl/get-user.query';
import { GetAllUsersQuery } from './queries/impl/get-all-users.query';
import { ValidateUserQuery } from './queries/impl/validate-user.query';
import { CreateUserCommand } from './commands/impl/create-user.command';

@Injectable()
export class UsersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createUser(email: string, password: string, role: string): Promise<User> {
    return this.commandBus.execute(new CreateUserCommand(email, password, role));
  }

  async getById(userId: number): Promise<User> {
    return this.queryBus.execute(new GetUserQuery(userId));
  }

  async getAllUsers(): Promise<User[]> {
    return this.queryBus.execute(new GetAllUsersQuery());
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    return this.queryBus.execute(new ValidateUserQuery(email, password));
  }
}