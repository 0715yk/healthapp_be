import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { WorkoutNum } from './workoutNum.entity';

@Entity()
export class Dates {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  date: string;

  @Column()
  workoutCount: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.dates)
  user: User;

  @OneToMany(() => WorkoutNum, (workoutNum) => workoutNum.dates)
  workoutNumbers: WorkoutNum[];
}
