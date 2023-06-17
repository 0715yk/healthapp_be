import { User } from './entities/user.entity';
import { UserRequestDto } from './dto/users.request.dto';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Dates } from 'src/workout/entities/dates.entity';
import { WorkoutService } from 'src/workout/workout.service';
import { WorkoutNum } from 'src/workout/entities/workoutNum.entity';
export declare class UserService {
    private dataSource;
    private userRepository;
    private datesRepository;
    private workoutNumRepository;
    private jwtService;
    private readonly workoutService;
    constructor(dataSource: DataSource, userRepository: Repository<User>, datesRepository: Repository<Dates>, workoutNumRepository: Repository<WorkoutNum>, jwtService: JwtService, workoutService: WorkoutService);
    signUp(body: UserRequestDto): Promise<{
        userId: string;
        nickname: string;
        jwtToken: string;
    }>;
    socialLogin(code: string): Promise<{
        nickname: any;
        jwtToken: string;
    }>;
    socialLoginNaver(code: string, state: string): Promise<{
        nickname: any;
        jwtToken: string;
    }>;
    updateNickname(token: string, nickname: string): Promise<import("typeorm").UpdateResult>;
    deleteUser(token: string, loginType: string): Promise<import("typeorm").DeleteResult>;
    kakaoLogout(token: string): Promise<void>;
    naverLogout(token: string): Promise<void>;
}
