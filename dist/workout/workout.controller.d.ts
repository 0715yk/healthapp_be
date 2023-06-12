import { JwtService } from '@nestjs/jwt';
import { WorkoutService } from './workout.service';
export declare class WorkoutController {
    private readonly workoutService;
    private jwtService;
    constructor(workoutService: WorkoutService, jwtService: JwtService);
    getLatestWorkout(req: any): Promise<{
        latestDate: string;
        length: number;
        toString(): string;
        toLocaleString(): string;
        pop(): import("./entities/workoutNum.entity").WorkoutNum;
        push(...items: import("./entities/workoutNum.entity").WorkoutNum[]): number;
        concat(...items: ConcatArray<import("./entities/workoutNum.entity").WorkoutNum>[]): import("./entities/workoutNum.entity").WorkoutNum[];
        concat(...items: (import("./entities/workoutNum.entity").WorkoutNum | ConcatArray<import("./entities/workoutNum.entity").WorkoutNum>)[]): import("./entities/workoutNum.entity").WorkoutNum[];
        join(separator?: string): string;
        reverse(): import("./entities/workoutNum.entity").WorkoutNum[];
        shift(): import("./entities/workoutNum.entity").WorkoutNum;
        slice(start?: number, end?: number): import("./entities/workoutNum.entity").WorkoutNum[];
        sort(compareFn?: (a: import("./entities/workoutNum.entity").WorkoutNum, b: import("./entities/workoutNum.entity").WorkoutNum) => number): import("./entities/workoutNum.entity").WorkoutNum[];
        splice(start: number, deleteCount?: number): import("./entities/workoutNum.entity").WorkoutNum[];
        splice(start: number, deleteCount: number, ...items: import("./entities/workoutNum.entity").WorkoutNum[]): import("./entities/workoutNum.entity").WorkoutNum[];
        unshift(...items: import("./entities/workoutNum.entity").WorkoutNum[]): number;
        indexOf(searchElement: import("./entities/workoutNum.entity").WorkoutNum, fromIndex?: number): number;
        lastIndexOf(searchElement: import("./entities/workoutNum.entity").WorkoutNum, fromIndex?: number): number;
        every<S extends import("./entities/workoutNum.entity").WorkoutNum>(predicate: (value: import("./entities/workoutNum.entity").WorkoutNum, index: number, array: import("./entities/workoutNum.entity").WorkoutNum[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: import("./entities/workoutNum.entity").WorkoutNum, index: number, array: import("./entities/workoutNum.entity").WorkoutNum[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: import("./entities/workoutNum.entity").WorkoutNum, index: number, array: import("./entities/workoutNum.entity").WorkoutNum[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: import("./entities/workoutNum.entity").WorkoutNum, index: number, array: import("./entities/workoutNum.entity").WorkoutNum[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: import("./entities/workoutNum.entity").WorkoutNum, index: number, array: import("./entities/workoutNum.entity").WorkoutNum[]) => U, thisArg?: any): U[];
        filter<S_1 extends import("./entities/workoutNum.entity").WorkoutNum>(predicate: (value: import("./entities/workoutNum.entity").WorkoutNum, index: number, array: import("./entities/workoutNum.entity").WorkoutNum[]) => value is S_1, thisArg?: any): S_1[];
        filter(predicate: (value: import("./entities/workoutNum.entity").WorkoutNum, index: number, array: import("./entities/workoutNum.entity").WorkoutNum[]) => unknown, thisArg?: any): import("./entities/workoutNum.entity").WorkoutNum[];
        reduce(callbackfn: (previousValue: import("./entities/workoutNum.entity").WorkoutNum, currentValue: import("./entities/workoutNum.entity").WorkoutNum, currentIndex: number, array: import("./entities/workoutNum.entity").WorkoutNum[]) => import("./entities/workoutNum.entity").WorkoutNum): import("./entities/workoutNum.entity").WorkoutNum;
        reduce(callbackfn: (previousValue: import("./entities/workoutNum.entity").WorkoutNum, currentValue: import("./entities/workoutNum.entity").WorkoutNum, currentIndex: number, array: import("./entities/workoutNum.entity").WorkoutNum[]) => import("./entities/workoutNum.entity").WorkoutNum, initialValue: import("./entities/workoutNum.entity").WorkoutNum): import("./entities/workoutNum.entity").WorkoutNum;
        reduce<U_1>(callbackfn: (previousValue: U_1, currentValue: import("./entities/workoutNum.entity").WorkoutNum, currentIndex: number, array: import("./entities/workoutNum.entity").WorkoutNum[]) => U_1, initialValue: U_1): U_1;
        reduceRight(callbackfn: (previousValue: import("./entities/workoutNum.entity").WorkoutNum, currentValue: import("./entities/workoutNum.entity").WorkoutNum, currentIndex: number, array: import("./entities/workoutNum.entity").WorkoutNum[]) => import("./entities/workoutNum.entity").WorkoutNum): import("./entities/workoutNum.entity").WorkoutNum;
        reduceRight(callbackfn: (previousValue: import("./entities/workoutNum.entity").WorkoutNum, currentValue: import("./entities/workoutNum.entity").WorkoutNum, currentIndex: number, array: import("./entities/workoutNum.entity").WorkoutNum[]) => import("./entities/workoutNum.entity").WorkoutNum, initialValue: import("./entities/workoutNum.entity").WorkoutNum): import("./entities/workoutNum.entity").WorkoutNum;
        reduceRight<U_2>(callbackfn: (previousValue: U_2, currentValue: import("./entities/workoutNum.entity").WorkoutNum, currentIndex: number, array: import("./entities/workoutNum.entity").WorkoutNum[]) => U_2, initialValue: U_2): U_2;
        find<S_2 extends import("./entities/workoutNum.entity").WorkoutNum>(predicate: (this: void, value: import("./entities/workoutNum.entity").WorkoutNum, index: number, obj: import("./entities/workoutNum.entity").WorkoutNum[]) => value is S_2, thisArg?: any): S_2;
        find(predicate: (value: import("./entities/workoutNum.entity").WorkoutNum, index: number, obj: import("./entities/workoutNum.entity").WorkoutNum[]) => unknown, thisArg?: any): import("./entities/workoutNum.entity").WorkoutNum;
        findIndex(predicate: (value: import("./entities/workoutNum.entity").WorkoutNum, index: number, obj: import("./entities/workoutNum.entity").WorkoutNum[]) => unknown, thisArg?: any): number;
        fill(value: import("./entities/workoutNum.entity").WorkoutNum, start?: number, end?: number): import("./entities/workoutNum.entity").WorkoutNum[];
        copyWithin(target: number, start: number, end?: number): import("./entities/workoutNum.entity").WorkoutNum[];
        entries(): IterableIterator<[number, import("./entities/workoutNum.entity").WorkoutNum]>;
        keys(): IterableIterator<number>;
        values(): IterableIterator<import("./entities/workoutNum.entity").WorkoutNum>;
        includes(searchElement: import("./entities/workoutNum.entity").WorkoutNum, fromIndex?: number): boolean;
        flatMap<U_3, This = undefined>(callback: (this: This, value: import("./entities/workoutNum.entity").WorkoutNum, index: number, array: import("./entities/workoutNum.entity").WorkoutNum[]) => U_3 | readonly U_3[], thisArg?: This): U_3[];
        flat<A, D extends number = 1>(this: A, depth?: D): FlatArray<A, D>[];
        [Symbol.iterator](): IterableIterator<import("./entities/workoutNum.entity").WorkoutNum>;
        [Symbol.unscopables](): {
            copyWithin: boolean;
            entries: boolean;
            fill: boolean;
            find: boolean;
            findIndex: boolean;
            keys: boolean;
            values: boolean;
        };
        at(index: number): import("./entities/workoutNum.entity").WorkoutNum;
    }>;
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
