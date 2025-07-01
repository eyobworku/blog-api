import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // Customize the response when authentication fails
    if (err || !user) {     
      throw err || new UnauthorizedException('Invalid token');
    }
    return user;
  }
}