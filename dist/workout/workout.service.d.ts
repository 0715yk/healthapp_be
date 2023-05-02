import { WorkoutNum } from './entities/workoutNum.entity';
import { JwtService } from '@nestjs/jwt';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { Dates } from './entities/dates.entity';
import { Repository, DataSource } from 'typeorm';
import { WorkoutName } from './entities/workoutName.entity';
import { Workout } from './entities/workout.entity';
export declare class WorkoutService {
    private dataSource;
    private datesRepository;
    private workoutNumRepository;
    private workoutNameRepository;
    private workoutRepository;
    private jwtService;
    constructor(dataSource: DataSource, datesRepository: Repository<Dates>, workoutNumRepository: Repository<WorkoutNum>, workoutNameRepository: Repository<WorkoutName>, workoutRepository: Repository<Workout>, jwtService: JwtService);
    create(userId: number, body: any): Promise<WorkoutNum>;
    findAll(): string;
    deleteWorkoutNum(datesId: number, workoutNum: number): Promise<void>;
    deleteWorkoutName(id: number, workoutNumId: number, datesId: number): Promise<void>;
    deleteWorkout(id: number, datesId: number, workoutNumId: any, workoutNameId: number): Promise<void>;
    updateWorkoutSet(id: number, body: {
        kg?: string;
        reps?: string;
    }): Promise<void>;
    updateWorkoutName(id: number, workoutName: string): Promise<void>;
    getLatestWorkout(id: number, workoutName: string): Promise<void>;
    findWorkouts(id: number, date: string): Promise<WorkoutNum[]>;
    update(id: number, updateWorkoutDto: UpdateWorkoutDto): string;
    remove(id: number): string;
}
