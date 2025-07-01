import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { GetUserHandler } from './queries/handlers/get-user.handler';
import { GetAllUsersHandler } from './queries/handlers/get-all-users.handler';
import { ValidateUserHandler } from './queries/handlers/validate-user.handler';

const CommandHandlers = [CreateUserHandler];
const QueryHandlers = [GetUserHandler, GetAllUsersHandler, ValidateUserHandler];

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
  providers: [UsersService, ...QueryHandlers, ...CommandHandlers],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
