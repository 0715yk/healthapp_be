import { WorkoutName } from './workoutName.entity';
import { Dates } from 'src/workout/entities/dates.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class WorkoutNum {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  workoutNumber: number;

  @Column()
  datesId: number;

  @ManyToOne(() => Dates, (dates) => dates.workoutNumbers, {
    onDelete: 'CASCADE',
  })
  dates: Dates;

  @OneToMany(() => WorkoutName, (workoutName) => workoutName.workoutNum)
  workoutNames: WorkoutName[];
}
