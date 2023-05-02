import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Dates } from 'src/workout/entities/dates.entity';
import { WorkoutModule } from 'src/workout/workout.module';
import { WorkoutNum } from 'src/workout/entities/workoutNum.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Dates]),
    TypeOrmModule.forFeature([WorkoutNum]),
    forwardRef(() => AuthModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
    WorkoutModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
