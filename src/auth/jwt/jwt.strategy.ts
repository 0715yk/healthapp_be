import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payload } from './jwt.payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
// JwtGuard를 실행하면 거치게됨
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // jwt 만료기간
      secretOrKey: process.env.JWT_SECRET, // 후에 env에 넣어줘야함
    });
  }

  async validate(payload: Payload) {
    // fe로부터 jwt토큰이 왔을 때
    const user = this.userRepository.findOneBy({ id: payload.sub });
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
