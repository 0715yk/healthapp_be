import { WorkoutNum } from './entities/workoutNum.entity';
import { JwtService } from '@nestjs/jwt';
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
    getLatestWorkout(id: number): Promise<{
        latestDate: string;
        length: number;
        toString(): string;
        toLocaleString(): string;
        pop(): WorkoutNum;
        push(...items: WorkoutNum[]): number;
        concat(...items: ConcatArray<WorkoutNum>[]): WorkoutNum[];
        concat(...items: (WorkoutNum | ConcatArray<WorkoutNum>)[]): WorkoutNum[];
        join(separator?: string): string;
        reverse(): WorkoutNum[];
        shift(): WorkoutNum;
        slice(start?: number, end?: number): WorkoutNum[];
        sort(compareFn?: (a: WorkoutNum, b: WorkoutNum) => number): WorkoutNum[];
        splice(start: number, deleteCount?: number): WorkoutNum[];
        splice(start: number, deleteCount: number, ...items: WorkoutNum[]): WorkoutNum[];
        unshift(...items: WorkoutNum[]): number;
        indexOf(searchElement: WorkoutNum, fromIndex?: number): number;
        lastIndexOf(searchElement: WorkoutNum, fromIndex?: number): number;
        every<S extends WorkoutNum>(predicate: (value: WorkoutNum, index: number, array: WorkoutNum[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: WorkoutNum, index: number, array: WorkoutNum[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: WorkoutNum, index: number, array: WorkoutNum[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: WorkoutNum, index: number, array: WorkoutNum[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: WorkoutNum, index: number, array: WorkoutNum[]) => U, thisArg?: any): U[];
        filter<S_1 extends WorkoutNum>(predicate: (value: WorkoutNum, index: number, array: WorkoutNum[]) => value is S_1, thisArg?: any): S_1[];
        filter(predicate: (value: WorkoutNum, index: number, array: WorkoutNum[]) => unknown, thisArg?: any): WorkoutNum[];
        reduce(callbackfn: (previousValue: WorkoutNum, currentValue: WorkoutNum, currentIndex: number, array: WorkoutNum[]) => WorkoutNum): WorkoutNum;
        reduce(callbackfn: (previousValue: WorkoutNum, currentValue: WorkoutNum, currentIndex: number, array: WorkoutNum[]) => WorkoutNum, initialValue: WorkoutNum): WorkoutNum;
        reduce<U_1>(callbackfn: (previousValue: U_1, currentValue: WorkoutNum, currentIndex: number, array: WorkoutNum[]) => U_1, initialValue: U_1): U_1;
        reduceRight(callbackfn: (previousValue: WorkoutNum, currentValue: WorkoutNum, currentIndex: number, array: WorkoutNum[]) => WorkoutNum): WorkoutNum;
        reduceRight(callbackfn: (previousValue: WorkoutNum, currentValue: WorkoutNum, currentIndex: number, array: WorkoutNum[]) => WorkoutNum, initialValue: WorkoutNum): WorkoutNum;
        reduceRight<U_2>(callbackfn: (previousValue: U_2, currentValue: WorkoutNum, currentIndex: number, array: WorkoutNum[]) => U_2, initialValue: U_2): U_2;
        find<S_2 extends WorkoutNum>(predicate: (this: void, value: WorkoutNum, index: number, obj: WorkoutNum[]) => value is S_2, thisArg?: any): S_2;
        find(predicate: (value: WorkoutNum, index: number, obj: WorkoutNum[]) => unknown, thisArg?: any): WorkoutNum;
        findIndex(predicate: (value: WorkoutNum, index: number, obj: WorkoutNum[]) => unknown, thisArg?: any): number;
        fill(value: WorkoutNum, start?: number, end?: number): WorkoutNum[];
        copyWithin(target: number, start: number, end?: number): WorkoutNum[];
        entries(): IterableIterator<[number, WorkoutNum]>;
        keys(): IterableIterator<number>;
        values(): IterableIterator<WorkoutNum>;
        includes(searchElement: WorkoutNum, fromIndex?: number): boolean;
        flatMap<U_3, This = undefined>(callback: (this: This, value: WorkoutNum, index: number, array: WorkoutNum[]) => U_3 | readonly U_3[], thisArg?: This): U_3[];
        flat<A, D extends number = 1>(this: A, depth?: D): FlatArray<A, D>[];
        [Symbol.iterator](): IterableIterator<WorkoutNum>;
        [Symbol.unscopables](): {
            copyWithin: boolean;
            entries: boolean;
            fill: boolean;
            find: boolean;
            findIndex: boolean;
            keys: boolean;
            values: boolean;
        };
        at(index: number): WorkoutNum;
    }>;
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
    findWorkouts(id: number, date: string): Promise<WorkoutNum[]>;
}