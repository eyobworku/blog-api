import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public getJwtTokenForLogin(user: User): string {
    const payload: TokenPayload = { 
      userId: user.id, 
      role: user.role 
    };
    const token = this.jwtService.sign(payload);
    return token
  }
}