import { UserRole } from '../../users/interfaces/user.role.enum';

export interface TokenPayload {
  userId: number;
  role: UserRole;
  iat?: number;  // issued at (auto-added by JWT)
  exp?: number;  // expiration time (auto-added by JWT)
}