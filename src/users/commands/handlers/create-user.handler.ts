import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../../interfaces/user.role.enum';
import { CreateUserCommand } from '../impl/create-user.command';
import {  plainToInstance } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserResponseDto> {
    const { email, password, role } = command;
    
    const user = this.userRepository.create({
      email,
      password,
      role: role as UserRole,
    });
    
    const savedUser = this.userRepository.save(user);
    return plainToInstance(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }
}