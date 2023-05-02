import { WorkoutName } from './workoutName.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Workout {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  workoutNameId: number;

  @Column()
  set: number;

  @Column()
  kg: string;

  @Column()
  reps: string;

  @Column()
  bestSet: boolean;

  @ManyToOne(() => WorkoutName, (workoutName) => workoutName.workouts, {
    onDelete: 'CASCADE',
  })
  workoutName: WorkoutName;
}
