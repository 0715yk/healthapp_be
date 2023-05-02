import { User } from 'src/user/entities/user.entity';
import { WorkoutNum } from './workoutNum.entity';
export declare class Dates {
    id: number;
    date: string;
    workoutCount: number;
    userId: number;
    user: User;
    workoutNumbers: WorkoutNum[];
}
