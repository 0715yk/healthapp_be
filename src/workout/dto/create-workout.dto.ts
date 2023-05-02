import { PickType } from '@nestjs/swagger';
import { Dates } from '../entities/dates.entity';

export class CreateWorkoutDto extends PickType(Dates, ['date'] as const) {}
