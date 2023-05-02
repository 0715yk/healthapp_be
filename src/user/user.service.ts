import { User } from './entities/user.entity';
import { UserRequestDto } from './dto/users.request.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Dates } from 'src/workout/entities/dates.entity';
import { WorkoutService } from 'src/workout/workout.service';
import { WorkoutNum } from 'src/workout/entities/workoutNum.entity';

@Injectable()
export class UserService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Dates) private datesRepository: Repository<Dates>,
    @InjectRepository(WorkoutNum)
    private workoutNumRepository: Repository<WorkoutNum>,
    private jwtService: JwtService,
    private readonly workoutService: WorkoutService,
  ) {}

  async signUp(body: UserRequestDto) {
    const { userId, nickname, password } = body;
    const isUserExist = await this.userRepository.findOneBy({ userId });

    if (isUserExist) {
      throw new UnauthorizedException('이미 존재하는 아이디 입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // 암호화
    const userObj = await this.userRepository.create({
      userId,
      nickname,
      password: hashedPassword,
    });
    const user = await this.userRepository.save(userObj);
    const payload = { userId: userId, sub: user.id };

    const jwtToken = this.jwtService.sign(payload);
    return { userId, nickname, jwtToken };
  }

  async updateNickname(token: string, nickname: string) {
    const pureToken = token.substring(7);
    const response = this.jwtService.decode(pureToken);
    const id = response.sub;
    const result = await this.userRepository.update(
      { id: id },
      { nickname: nickname },
    );
    return result;
  }

  async deleteUser(token: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const pureToken = token.substring(7);
      const response = this.jwtService.decode(pureToken);
      const id = response.sub;

      const dates = await this.datesRepository.find({ where: { userId: id } });
      dates.forEach(async (date) => {
        const dateId = date.id;
        await this.datesRepository.delete({ id: dateId });
      });

      const result = await this.userRepository.delete({ id: id });
      return result;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
