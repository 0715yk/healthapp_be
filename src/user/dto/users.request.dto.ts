import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserRequestDto extends PickType(User, [
  'userId',
  'nickname',
  'password',
] as const) {}

export class SocialLoginUserRequestDto extends PickType(User, [
  'userId',
  'nickname',
] as const) {}
