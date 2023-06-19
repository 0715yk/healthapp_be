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
import axios from 'axios';

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

  async socialLogin(code: string) {
    const postBody = {
      code,
      client_id: `${process.env.REST_API_KEY}`,
      redirect_uri: `${process.env.REDIRECT_URL}`,
      grant_type: 'authorization_code',
      client_secret: `${process.env.CLIENT_SECRET_KEY}`,
    };

    try {
      // fetch로 하니까 안됨.. why?
      const response = await axios.post(
        `${process.env.KAKAO_LOGIN_URL}`,
        postBody,
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const data = response.data;

      const ACCESS_TOKEN = data.access_token;
      const userInform = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-type': 'application/x-www-form-urlencoded',
        },
      });

      const userInformResponse = userInform.data;
      const {
        id,
        kakao_account: {
          profile: { nickname },
        },
      } = userInformResponse;
      const userId = String(id);
      const isUserExist = await this.userRepository.findOneBy({
        userId,
      });

      if (isUserExist) {
        // 이미 존재한다면
        const payload = {
          userId,
          sub: isUserExist.id,
          jwtToken: ACCESS_TOKEN,
        };
        const jwtToken = this.jwtService.sign(payload);
        return { nickname, jwtToken };
      } else {
        const hashedPassword = await bcrypt.hash(userId, 10);
        // 비밀번호가  필요없음 그러나 일단은 email 로 만들기
        // 암호화
        const userObj = await this.userRepository.create({
          userId,
          nickname,
          password: hashedPassword,
        });
        const user = await this.userRepository.save(userObj);
        const payload = { userId, sub: user.id, jwtToken: ACCESS_TOKEN };

        const jwtToken = this.jwtService.sign(payload);
        return { nickname, jwtToken };
      }

      // 허용 ip 주소를 progressive 이걸로 해야할듯
    } catch (e) {
      console.log(e);
    }
  }

  async socialLoginNaver(code: string, state: string) {
    const postBody = {
      code,
      client_id: `${process.env.NAVER_CLIENT_ID}`,
      redirect_uri: `${process.env.NAVER_REDIRECT_URL}`,
      grant_type: 'authorization_code',
      client_secret: `${process.env.NAVER_CLIENT_SECRET_KEY}`,
      state,
    };

    try {
      // fetch로 하니까 안됨.. why?

      const response = await axios.post(
        `${process.env.NAVER_LOGIN_URL}`,
        postBody,
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const data = response.data;
      const ACCESS_TOKEN = data.access_token;
      const userInform = await axios.get(
        `https://openapi.naver.com/v1/nid/me?access_token=${ACCESS_TOKEN}`,
      );

      const userInformResponse = userInform.data;
      const { id, nickname } = userInformResponse.response;
      const replacedNickname = nickname.replace(/ /g, '');
      const isUserExist = await this.userRepository.findOneBy({
        userId: id,
      });

      if (isUserExist) {
        // 이미 존재한다면
        const payload = {
          userId: id,
          sub: isUserExist.id,
          jwtToken: ACCESS_TOKEN,
        };
        const jwtToken = this.jwtService.sign(payload);
        return { nickname: replacedNickname, jwtToken };
      } else {
        const hashedPassword = await bcrypt.hash(id, 10);
        // 비밀번호가  필요없음 그러나 일단은 email 로 만들기
        // 암호화
        const userObj = await this.userRepository.create({
          userId: id,
          nickname: replacedNickname,
          password: hashedPassword,
        });
        const user = await this.userRepository.save(userObj);
        const payload = { userId: id, sub: user.id, jwtToken: ACCESS_TOKEN };

        const jwtToken = this.jwtService.sign(payload);
        return { nickname: replacedNickname, jwtToken };
      }
    } catch (e) {
      console.log(e);
    }
  }

  async updateNickname(token: string, nickname: string) {
    const pureToken = token.substring(7);
    const response = this.jwtService.decode(pureToken) as {
      sub: number;
      jwtToken: string;
      userid: string;
    };
    const id = response.sub;
    const result = await this.userRepository.update(
      { id: id },
      { nickname: nickname },
    );
    return result;
  }

  async deleteUser(token: string, loginType: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const pureToken = token.substring(7);
      const response = this.jwtService.decode(pureToken) as {
        sub: number;
        jwtToken: string;
        userid: string;
      };

      const id = response.sub;
      await this.datesRepository.delete({ userId: id });
      const result = await this.userRepository.delete({ id: id });

      if (loginType === 'kakako') {
        const ACCESS_TOKEN = response.jwtToken;

        await axios.get('https://kapi.kakao.com/v1/user/unlink', {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      } else if (loginType === 'naver') {
        const ACCESS_TOKEN = response.jwtToken;

        await axios.post(
          `https://nid.naver.com/oauth2.0/token?access_token=${encodeURIComponent(
            ACCESS_TOKEN,
          )}&service_provider=${'NAVER'}&client_secret=${
            process.env.NAVER_CLIENT_SECRET_KEY
          }&client_id=${process.env.NAVER_CLIENT_ID}&grant_type=delete`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        );
      }

      return result;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async kakaoLogout(token: string) {
    const pureToken = token.substring(7);
    const response = this.jwtService.decode(pureToken) as {
      sub: number;
      jwtToken: string;
      userid: string;
    };
    const ACCESS_TOKEN = response.jwtToken;
    try {
      await axios.get('https://kapi.kakao.com/v1/user/unlink', {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async naverLogout(token: string) {
    const pureToken = token.substring(7);
    const response = this.jwtService.decode(pureToken) as {
      sub: number;
      jwtToken: string;
      userid: string;
    };
    const ACCESS_TOKEN = response.jwtToken;
    try {
      await axios.post(
        `https://nid.naver.com/oauth2.0/token?access_token=${encodeURIComponent(
          ACCESS_TOKEN,
        )}&service_provider=${'NAVER'}&client_secret=${
          process.env.NAVER_CLIENT_SECRET_KEY
        }&client_id=${process.env.NAVER_CLIENT_ID}&grant_type=delete`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
    } catch (e) {
      console.log(e);
    }
  }
}
