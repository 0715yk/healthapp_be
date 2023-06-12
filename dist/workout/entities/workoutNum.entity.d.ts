import { WorkoutName } from './workoutName.entity';
import { Dates } from 'src/workout/entities/dates.entity';
export declare class WorkoutNum {
    id: number;
    workoutNumber: number;
    datesId: number;
    dates: Dates;
    workoutNames: WorkoutName[];
}
