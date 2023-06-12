import { WorkoutNum } from './workoutNum.entity';
import { Workout } from './workout.entity';
export declare class WorkoutName {
    id: number;
    workoutNumId: number;
    workoutName: string;
    workoutNum: WorkoutNum;
    workouts: Workout[];
}
