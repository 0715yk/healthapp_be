import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async jwtLogin(data: LoginRequestDto) {
    const { userId, password } = data;
    const user = await this.userRepository.findOneBy({ userId });

    if (!user) {
      throw new UnauthorizedException('아이디와 비밀번호를 확인해주세요.');
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('아이디와 비밀번호를 확인해주세요.');
    }

    const payload = { userId: userId, sub: user.id };

    return {
      nickname: user.nickname,
      token: this.jwtService.sign(payload),
      // 이제 이걸 fe쪽에서 안전한 곳에 저장하면 됨.
      // 웹 같은 경우 httpOnlyCookie? 란 곳에 하는 편이고,
      // 모바일 같은 경우에는 os마다 따로 있다고함.
    };
  }
}
