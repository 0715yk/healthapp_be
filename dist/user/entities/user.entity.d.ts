import { Dates } from 'src/workout/entities/dates.entity';
export declare class User {
    id: number;
    userId: string;
    nickname: string;
    password: string;
    dates: Dates[];
}
