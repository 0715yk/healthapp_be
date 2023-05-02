import { Dates } from 'src/workout/entities/dates.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: string;

  @Column()
  nickname: string;

  @Column()
  password: string;

  @OneToMany(() => Dates, (Dates) => Dates.user)
  dates: Dates[];
}
