import { LoginRequestDto } from './dto/login.request.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    jwtLogin(data: LoginRequestDto): Promise<{
        nickname: string;
        token: string;
    }>;
}
