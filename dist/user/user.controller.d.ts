import { UserRequestDto } from './dto/users.request.dto';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
export declare class UserController {
    private readonly userSerivce;
    private readonly authService;
    constructor(userSerivce: UserService, authService: AuthService);
    getCurrentUser(user: any): any;
    signUp(body: UserRequestDto): Promise<{
        userId: string;
        nickname: string;
        jwtToken: string;
    }>;
    logIn(data: LoginRequestDto): Promise<{
        nickname: string;
        token: string;
    }>;
    deleteUser(req: any): void;
    updateNickname(req: any, body: any): void;
    kakaoLogin(res: any, query: {
        code: string;
    }): Promise<void>;
    kakaoLogout(req: any): Promise<void>;
    googleLogin(res: any, query: {
        code: string;
    }): Promise<void>;
    googleLogout(req: any): Promise<void>;
}
