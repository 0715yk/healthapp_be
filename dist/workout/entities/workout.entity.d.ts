import { WorkoutName } from './workoutName.entity';
export declare class Workout {
    id: number;
    workoutNameId: number;
    set: number;
    kg: string;
    reps: string;
    bestSet: boolean;
    workoutName: WorkoutName;
}
