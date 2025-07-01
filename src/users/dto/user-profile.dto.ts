import { Expose } from 'class-transformer';

export class UserProfileDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  role: string;
}