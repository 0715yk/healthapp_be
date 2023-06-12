import { User } from './entities/user.entity';
import {
  SocialLoginUserRequestDto,
  UserRequestDto,
} from './dto/users.request.dto';
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
      // 토큰을 발급 받았음.
      // 이 때, 회원가입을 한 유저인지 아닌지를 판별해야함
      //       access_token: 'ITthlRm1hjpqHtCPLhahqz0tzHW-oSrvGIDBnP8wCj10lwAAAYiD-t4w',
      // token_type: 'bearer',
      // refresh_token: 'vlPVCmDWe8KI0r66Mb78G4lSgIy3CWv5_ohe8I8ECj10lwAAAYiD-t4v',
      // expires_in: 21599,
      // scope: 'account_email profile_nickname',
      // refresh_token_expires_in: 5183999
      // 회원가입 했으면 그냥 토큰을 우리식대로 발급하고 끝
      // 안했으면 email 정보를 id에 nickname을 nickname에 등록하면됨(비밀번호는 필요없음)
      //

      const ACCESS_TOKEN = data.access_token;
      const userInform = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-type': 'application/x-www-form-urlencoded',
        },
      });
      //       id: 2818870231,
      // connected_at: '2023-06-04T01:15:16Z',
      // properties: { nickname: '홍용기' },
      // kakao_account: {
      //   profile_nickname_needs_agreement: false,
      //   profile: { nickname: '홍용기' },
      //   has_email: true,
      //   email_needs_agreement: false,
      //   is_email_valid: true,
      //   is_email_verified: true,
      //   email: 'calmmne@naver.com'
      // }
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

  async deleteUser(token: string) {
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

      if (response.jwtToken !== undefined) {
        const ACCESS_TOKEN = response.jwtToken;

        await axios.get('https://kapi.kakao.com/v1/user/unlink', {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
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
}
