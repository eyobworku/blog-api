import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../../users/interfaces/user.role.enum';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role: UserRole = UserRole.USER;
}