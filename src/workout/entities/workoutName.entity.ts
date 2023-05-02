import { WorkoutNum } from './workoutNum.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Workout } from './workout.entity';

@Entity()
export class WorkoutName {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  workoutNumId: number;

  @Column()
  workoutName: string;

  @ManyToOne(() => WorkoutNum, (workoutNum) => workoutNum.workoutNames, {
    onDelete: 'CASCADE',
  })
  workoutNum: WorkoutNum;

  @OneToMany(() => Workout, (workout) => workout.workoutName)
  workouts: Workout[];
}
