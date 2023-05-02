import { WorkoutNum } from './entities/workoutNum.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { Dates } from './entities/dates.entity';
import { WorkoutName } from './entities/workoutName.entity';
import { Workout } from './entities/workout.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dates, WorkoutNum, WorkoutName, Workout]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
  ],
  controllers: [WorkoutController],
  providers: [WorkoutService],
  exports: [WorkoutService],
})
export class WorkoutModule {}
