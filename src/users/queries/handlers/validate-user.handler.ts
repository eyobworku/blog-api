import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ValidateUserQuery } from '../impl/validate-user.query';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@QueryHandler(ValidateUserQuery)
export class ValidateUserHandler implements IQueryHandler<ValidateUserQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(query: ValidateUserQuery): Promise<UserResponseDto | null> {
    const { email, password } = query;
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (user && await user.comparePassword(password)) {
      return user;
    }
    return null;
  }
}