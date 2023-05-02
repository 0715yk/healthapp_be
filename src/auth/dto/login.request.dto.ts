import { User } from './../../user/entities/user.entity';
import { PickType } from '@nestjs/swagger';

export class LoginRequestDto extends PickType(User, [
  'userId',
  'password',
] as const) {}
