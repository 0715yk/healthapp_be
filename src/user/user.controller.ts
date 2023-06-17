import { UserRequestDto } from './dto/users.request.dto';
import { UserService } from './user.service';
import { CurrentUser } from '../common/decorators/user.decorator';
import { AuthService } from '../auth/auth.service';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
  Req,
  Patch,
  Res,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { UserInformValidationPipe } from 'src/common/pipes/userInformValidationPipe.pipe';
import { UserNicknameValidation } from 'src/common/pipes/userNicknameValidation.pipe';

@Controller('users')
export class UserController {
  constructor(
    private readonly userSerivce: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiResponse({
    status: 401,
  })
  @ApiResponse({
    status: 200,
    description: '성공!',
    type: LoginRequestDto,
  })
  @ApiOperation({ summary: '현재 유저 정보 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@CurrentUser() user) {
    return user;
  }

  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 201,
    description: '성공!',
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  @UsePipes(UserInformValidationPipe)
  async signUp(@Body() body: UserRequestDto) {
    const response = await this.userSerivce.signUp(body);
    return response;
  }

  @ApiResponse({
    status: 401,
    description: '이메일과 비밀번호를 확인해주세요.',
  })
  @ApiResponse({
    status: 201,
    description: '성공!',
    type: LoginRequestDto,
  })
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    const response = this.authService.jwtLogin(data);
    return response;
  }

  @ApiResponse({
    status: 200,
    description: '성공!',
  })
  @Post('delete')
  deleteUser(@Body() data: { loginType: string }, @Req() req) {
    this.userSerivce.deleteUser(req.headers['authorization'], data.loginType);
  }

  @ApiResponse({
    status: 200,
    description: '성공!',
  })
  @Patch('nickname')
  @UseGuards(JwtAuthGuard)
  @UsePipes(UserNicknameValidation)
  updateNickname(@Req() req, @Body() body) {
    const nickname = body.nickname;
    this.userSerivce.updateNickname(req.headers['authorization'], nickname);
  }

  @Get('kakao')
  async kakaoLogin(
    @Res() res,
    @Query() query: { code: string },
  ): Promise<void> {
    const { code } = query;
    const response = await this.userSerivce.socialLogin(code);
    // 다른 도메인으로는 이렇게 쿠키를 넣은채 redirect 할 수 없다??
    if (response?.jwtToken) {
      return res.redirect(
        `${process.env.FE_URL}main?code=${response.jwtToken}`,
      );
    } else {
      return res.redirect(`${process.env.CANCEL_REDIRECT_URL}?type=cancel`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('kakaoLogout')
  async kakaoLogout(@Req() req): Promise<void> {
    await this.userSerivce.kakaoLogout(req.headers['authorization']);
  }

  @Get('naver')
  async naverLogin(
    @Res() res,
    @Query() query: { code: string; state: string },
  ): Promise<void> {
    const { code, state } = query;

    const response = await this.userSerivce.socialLoginNaver(code, state);

    // 다른 도메인으로는 이렇게 쿠키를 넣은채 redirect 할 수 없다??
    if (response?.jwtToken) {
      return res.redirect(
        `${process.env.FE_URL}main?code=${response.jwtToken}`,
      );
    } else {
      return res.redirect(`${process.env.CANCEL_REDIRECT_URL}?type=cancel`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('naverLogout')
  async naverLogout(@Req() req): Promise<void> {
    await this.userSerivce.naverLogout(req.headers['authorization']);
  }
}
