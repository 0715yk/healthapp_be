import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Payload } from './jwt.payload';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userRepository;
    constructor(userRepository: Repository<User>);
    validate(payload: Payload): Promise<User>;
}
export {};
