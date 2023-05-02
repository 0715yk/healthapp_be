import { User } from '../entities/user.entity';
declare const UserRequestDto_base: import("@nestjs/common").Type<Pick<User, "userId" | "password" | "nickname">>;
export declare class UserRequestDto extends UserRequestDto_base {
}
export {};
