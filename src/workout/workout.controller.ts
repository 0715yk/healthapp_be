import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WorkoutService } from './workout.service';

@Controller('workout')
export class WorkoutController {
  constructor(
    private readonly workoutService: WorkoutService,
    private jwtService: JwtService,
  ) {}

  @Get('/latest')
  @UseGuards(JwtAuthGuard)
  getLatestWorkout(@Req() req) {
    const pureToken = req?.headers['authorization']?.substring(7);
    const response = this.jwtService.decode(pureToken) as {
      userId: string;
      sub: number;
    };
    const id = response.sub;
    return this.workoutService.getLatestWorkout(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() body: any) {
    const pureToken = req?.headers['authorization']?.substring(7);
    const response = this.jwtService.decode(pureToken) as {
      userId: string;
      sub: number;
    };
    const id = response.sub;
    return this.workoutService.create(id, body);
  }

  @Delete('/workoutNum')
  @UseGuards(JwtAuthGuard)
  deleteWorkoutNum(@Body() body: { datesId: number; workoutNum: number }) {
    return this.workoutService.deleteWorkoutNum(body.datesId, body.workoutNum);
  }

  @Delete('/workoutName')
  @UseGuards(JwtAuthGuard)
  deleteWorkoutName(
    @Body() body: { id: number; workoutNumId: number; datesId: number },
  ) {
    return this.workoutService.deleteWorkoutName(
      body.id,
      body.workoutNumId,
      body.datesId,
    );
  }

  @Delete('/workout')
  @UseGuards(JwtAuthGuard)
  deleteWorkout(
    @Body()
    body: {
      id: number;
      datesId: number;
      workoutNumId: number;
      workoutNameId: number;
    },
  ) {
    return this.workoutService.deleteWorkout(
      body.id,
      body.datesId,
      body.workoutNumId,
      body.workoutNameId,
    );
  }

  @Get('/:date')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req, @Param('date') date: string) {
    const pureToken = req?.headers['authorization']?.substring(7);
    const response = this.jwtService.decode(pureToken) as {
      userId: string;
      sub: number;
    };
    const id = response.sub;
    return this.workoutService.findWorkouts(id, date);
  }

  @Patch('workoutSet/:id')
  updateWorkoutSet(
    @Param('id') id: number,
    @Body()
    body: {
      kg?: string;
      reps?: string;
    },
  ) {
    return this.workoutService.updateWorkoutSet(id, body);
  }

  @Patch('workoutName/:id')
  updateWorkoutName(
    @Param('id') id: number,
    @Body('workoutName')
    workoutName: string,
  ) {
    return this.workoutService.updateWorkoutName(id, workoutName);
  }
}
