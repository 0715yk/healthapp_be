import { JwtService } from '@nestjs/jwt';
import { WorkoutService } from './workout.service';
export declare class WorkoutController {
    private readonly workoutService;
    private jwtService;
    constructor(workoutService: WorkoutService, jwtService: JwtService);
    create(req: any, body: any): Promise<import("./entities/workoutNum.entity").WorkoutNum>;
    deleteWorkoutNum(body: {
        datesId: number;
        workoutNum: number;
    }): Promise<void>;
    deleteWorkoutName(body: {
        id: number;
        workoutNumId: number;
        datesId: number;
    }): Promise<void>;
    deleteWorkout(body: {
        id: number;
        datesId: number;
        workoutNumId: number;
        workoutNameId: number;
    }): Promise<void>;
    findOne(req: any, date: string): Promise<import("./entities/workoutNum.entity").WorkoutNum[]>;
    updateWorkoutSet(id: number, body: {
        kg?: string;
        reps?: string;
    }): Promise<void>;
    updateWorkoutName(id: number, workoutName: string): Promise<void>;
}
