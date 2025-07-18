import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/interfaces/user.role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);