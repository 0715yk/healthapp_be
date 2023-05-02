import { User } from 'src/user/entities/user.entity';
import { WorkoutNum } from './entities/workoutNum.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { Dates } from './entities/dates.entity';
import { Repository, DataSource } from 'typeorm';
import { WorkoutName } from './entities/workoutName.entity';
import { Workout } from './entities/workout.entity';

// TODO 쿼리문 찍히도록 하기
@Injectable()
export class WorkoutService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Dates) private datesRepository: Repository<Dates>,
    @InjectRepository(WorkoutNum)
    private workoutNumRepository: Repository<WorkoutNum>,
    @InjectRepository(WorkoutName)
    private workoutNameRepository: Repository<WorkoutName>,
    @InjectRepository(Workout)
    private workoutRepository: Repository<Workout>,
    private jwtService: JwtService,
  ) {}

  // TODO => 자동으로 생성하게 코드 간편화하기
  async create(userId: number, body: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { date, workouts } = body;

      const existsOrNot = await this.datesRepository.findOne({
        where: { userId, date },
      });

      if (existsOrNot) {
        // 유저ID, 날짜에 이미 운동을 한번이라도 했으면
        // 이거 procedure 처리해야함. 중간에 하나라도 실패하면 다 포기하도록

        await this.datesRepository.update(
          { id: existsOrNot.id },
          { workoutCount: existsOrNot.workoutCount + 1 },
        );

        // workoutCount를 +1해주고
        const workoutNumId = existsOrNot.id;
        const workoutNumObj = await this.workoutNumRepository.create({
          datesId: workoutNumId,
          workoutNumber: existsOrNot.workoutCount + 1,
        });
        const workoutNumResult = await this.workoutNumRepository.save(
          workoutNumObj,
        );
        // 여기서 이 workoutNumId를 가지고 workoutName을 등록해야하는데,,,,
        // 흠..이건 배열로 받아서 forEach로 하나씩 등록해보자
        const resultId = workoutNumResult?.id;
        if (resultId) {
          workouts.forEach(async (workoutArr) => {
            const workoutNumObj = await this.workoutNameRepository.create({
              workoutNumId: resultId,
              workoutName: workoutArr[0].name,
            });
            const workoutNumResult = await this.workoutNameRepository.save(
              workoutNumObj,
            );

            const workoutNumResultId = workoutNumResult.id;
            if (workoutNumResultId) {
              workoutArr.forEach(async (workout) => {
                const workoutNumObj = await this.workoutRepository.create({
                  workoutNameId: workoutNumResultId,
                  set: workout.set,
                  reps: workout.reps,
                  kg: workout.kg,
                  bestSet: workout.bestSet,
                });
                await this.workoutRepository.save(workoutNumObj);
              });
            }
          });
        }
      } else {
        // 한번도 안했으면

        const datesObj = await this.datesRepository.create({
          date: date,
          workoutCount: 1,
          userId,
        });

        const result = await this.datesRepository.save(datesObj);

        const workoutNumObj = await this.workoutNumRepository.create({
          datesId: result.id,
          workoutNumber: 1,
        });
        const workoutNumResult = await this.workoutNumRepository.save(
          workoutNumObj,
        );

        const resultId = workoutNumResult?.id;

        if (resultId) {
          workouts.forEach(async (workoutArr) => {
            const workoutNumObj = await this.workoutNameRepository.create({
              workoutNumId: resultId,
              workoutName: workoutArr[0].name,
            });
            const workoutNumResult = await this.workoutNameRepository.save(
              workoutNumObj,
            );
            const workoutNumResultId = workoutNumResult.id;
            if (workoutNumResultId) {
              workoutArr.forEach(async (workout) => {
                const workoutNumObj = await this.workoutRepository.create({
                  workoutNameId: workoutNumResultId,
                  set: workout.set,
                  reps: workout.reps,
                  kg: workout.kg,
                  bestSet: workout.bestSet,
                });
                await this.workoutRepository.save(workoutNumObj);
              });
            }
          });
        }

        return workoutNumResult;
      }
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all workout`;
  }

  // TODO => 날짜 단위로 삭제할 수 있게 만들기
  async deleteWorkoutNum(datesId: number, workoutNum: number) {
    const response = await this.workoutNumRepository.findBy({
      datesId,
    });
    const workoutNumLen = response.length;
    if (workoutNumLen === 1) {
      this.datesRepository.delete({
        id: datesId,
      });
    } else {
      this.workoutNumRepository.delete({
        id: workoutNum,
      });
    }
  }

  async deleteWorkoutName(id: number, workoutNumId: number, datesId: number) {
    const response = await this.workoutNameRepository.findBy({
      workoutNumId,
    });

    if (response.length === 1) {
      const response = await this.deleteWorkoutNum(datesId, workoutNumId);
    } else {
      const response = this.workoutNameRepository.delete({
        id,
      });
    }
  }

  async deleteWorkout(
    id: number,
    datesId: number,
    workoutNumId,
    workoutNameId: number,
  ) {
    const response = await this.workoutRepository.findBy({
      workoutNameId,
    });

    if (response.length === 1) {
      // TODO : 이것도 cascade처럼 자동화할 수 있는가?
      await this.deleteWorkoutName(workoutNameId, workoutNumId, datesId);
    } else {
      this.workoutRepository.delete({
        id,
      });
    }
  }

  async updateWorkoutSet(
    id: number,
    body: {
      kg?: string;
      reps?: string;
    },
  ) {
    try {
      const response = await this.workoutRepository.update(
        {
          id,
        },
        {
          ...body,
        },
      );
    } catch {}
  }

  async updateWorkoutName(id: number, workoutName: string) {
    try {
      const response = await this.workoutNameRepository.update(
        {
          id,
        },
        {
          workoutName,
        },
      );
    } catch {}
  }

  async getLatestWorkout(id: number, workoutName: string) {
    try {
      // const response = await this.workoutNameRepository.findOneBy();
      // userId 만 가지고 date 테이블에서 order한다음에 첫번째 데이터의 id값을 가져온다음에
      // 그 id를 가지고 workoutNum
    } catch {}
  }

  async findWorkouts(id: number, date: string) {
    // 유저id, date 값을 바탕으로 datesId를 가져옴(이건 무조건 한개임)

    const data = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.dates', 'date')
      .leftJoinAndSelect('date.workoutNumbers', 'workoutNum')
      .leftJoinAndSelect('workoutNum.workoutNames', 'workoutName')
      .leftJoinAndSelect('workoutName.workouts', 'workout')
      .where('date.userId = :id', { id: id })
      .andWhere('date.date = :date', { date })
      .getMany();

    const result = data[0]?.dates[0]?.workoutNumbers;
    return result;
  }

  update(id: number, updateWorkoutDto: UpdateWorkoutDto) {
    return `This action updates a #${id} workout`;
  }

  remove(id: number) {
    return `This action removes a #${id} workout`;
  }
}
