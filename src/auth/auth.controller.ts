import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body(ValidationPipe) registrationData: RegisterDto) {
    return this.usersService.createUser(
      registrationData.email,
      registrationData.password,
      registrationData.role,
    );
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginData: LoginDto) {
    const user = await this.usersService.validateUser(
      loginData.email,
      loginData.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.authService.getJwtTokenForLogin(user);
    return { message: 'Logged in successfully', token };
  }

  @Post('logout')
  async logout() {
    return {
      message: 'Logged out successfully',
      token: '',
    };
  }
}
