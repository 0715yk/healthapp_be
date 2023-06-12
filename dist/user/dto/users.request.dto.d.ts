import { User } from '../entities/user.entity';
declare const UserRequestDto_base: import("@nestjs/common").Type<Pick<User, "userId" | "nickname" | "password">>;
export declare class UserRequestDto extends UserRequestDto_base {
}
declare const SocialLoginUserRequestDto_base: import("@nestjs/common").Type<Pick<User, "userId" | "nickname">>;
export declare class SocialLoginUserRequestDto extends SocialLoginUserRequestDto_base {
}
export {};
