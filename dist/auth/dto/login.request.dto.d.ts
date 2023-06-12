import { User } from './../../user/entities/user.entity';
declare const LoginRequestDto_base: import("@nestjs/common").Type<Pick<User, "userId" | "password">>;
export declare class LoginRequestDto extends LoginRequestDto_base {
}
export {};
