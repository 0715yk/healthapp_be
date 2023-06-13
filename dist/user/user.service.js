"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_entity_1 = require("./entities/user.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const dates_entity_1 = require("../workout/entities/dates.entity");
const workout_service_1 = require("../workout/workout.service");
const workoutNum_entity_1 = require("../workout/entities/workoutNum.entity");
const axios_1 = require("axios");
let UserService = class UserService {
    constructor(dataSource, userRepository, datesRepository, workoutNumRepository, jwtService, workoutService) {
        this.dataSource = dataSource;
        this.userRepository = userRepository;
        this.datesRepository = datesRepository;
        this.workoutNumRepository = workoutNumRepository;
        this.jwtService = jwtService;
        this.workoutService = workoutService;
    }
    async signUp(body) {
        const { userId, nickname, password } = body;
        const isUserExist = await this.userRepository.findOneBy({ userId });
        if (isUserExist) {
            throw new common_1.UnauthorizedException('이미 존재하는 아이디 입니다.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
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
    async socialLogin(code) {
        const postBody = {
            code,
            client_id: `${process.env.REST_API_KEY}`,
            redirect_uri: `${process.env.REDIRECT_URL}`,
            grant_type: 'authorization_code',
            client_secret: `${process.env.CLIENT_SECRET_KEY}`,
        };
        try {
            const response = await axios_1.default.post(`${process.env.KAKAO_LOGIN_URL}`, postBody, {
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                },
            });
            const data = response.data;
            const ACCESS_TOKEN = data.access_token;
            const userInform = await axios_1.default.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    'Content-type': 'application/x-www-form-urlencoded',
                },
            });
            const userInformResponse = userInform.data;
            const { id, kakao_account: { profile: { nickname }, }, } = userInformResponse;
            const userId = String(id);
            const isUserExist = await this.userRepository.findOneBy({
                userId,
            });
            if (isUserExist) {
                const payload = {
                    userId,
                    sub: isUserExist.id,
                    jwtToken: ACCESS_TOKEN,
                };
                const jwtToken = this.jwtService.sign(payload);
                return { nickname, jwtToken };
            }
            else {
                const hashedPassword = await bcrypt.hash(userId, 10);
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
        }
        catch (e) {
            console.log(e);
        }
    }
    async socialLoginGoogle(code) {
        const postBody = {
            code,
            client_id: `${process.env.GOOGLE_CLIENT_ID}`,
            redirect_uri: `${process.env.GOOGLE_REDIRECT_URL}`,
            grant_type: 'authorization_code',
            client_secret: `${process.env.GOOGLE_CLIENT_SECRET_KEY}`,
            access_type: 'offline',
        };
        try {
            const response = await axios_1.default.post(`${process.env.GOOGLE_LOGIN_URL}`, postBody, {
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                },
            });
            const data = response.data;
            const ACCESS_TOKEN = data.access_token;
            const userInform = await axios_1.default.get(`https://www.googleapis.com/userinfo/v2/me?access_token=${ACCESS_TOKEN}`);
            const userInformResponse = userInform.data;
            const { email, name } = userInformResponse;
            const nickname = name.replace(/ /g, '');
            const isUserExist = await this.userRepository.findOneBy({
                userId: email,
            });
            if (isUserExist) {
                const payload = {
                    userId: email,
                    sub: isUserExist.id,
                    jwtToken: ACCESS_TOKEN,
                };
                const jwtToken = this.jwtService.sign(payload);
                return { nickname, jwtToken };
            }
            else {
                const hashedPassword = await bcrypt.hash(email, 10);
                const userObj = await this.userRepository.create({
                    userId: email,
                    nickname,
                    password: hashedPassword,
                });
                const user = await this.userRepository.save(userObj);
                const payload = { userId: email, sub: user.id, jwtToken: ACCESS_TOKEN };
                const jwtToken = this.jwtService.sign(payload);
                return { nickname, jwtToken };
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async updateNickname(token, nickname) {
        const pureToken = token.substring(7);
        const response = this.jwtService.decode(pureToken);
        const id = response.sub;
        const result = await this.userRepository.update({ id: id }, { nickname: nickname });
        return result;
    }
    async deleteUser(token) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const pureToken = token.substring(7);
            const response = this.jwtService.decode(pureToken);
            const id = response.sub;
            await this.datesRepository.delete({ userId: id });
            const result = await this.userRepository.delete({ id: id });
            if (response.jwtToken !== undefined) {
                const ACCESS_TOKEN = response.jwtToken;
                await axios_1.default.get('https://kapi.kakao.com/v1/user/unlink', {
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
            }
            return result;
        }
        catch (err) {
            console.error(err);
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    async kakaoLogout(token) {
        const pureToken = token.substring(7);
        const response = this.jwtService.decode(pureToken);
        const ACCESS_TOKEN = response.jwtToken;
        try {
            await axios_1.default.get('https://kapi.kakao.com/v1/user/unlink', {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    async googleLogout(token) {
        const pureToken = token.substring(7);
        const response = this.jwtService.decode(pureToken);
        const ACCESS_TOKEN = response.jwtToken;
        try {
            await axios_1.default.post(`https://oauth2.googleapis.com/revoke?token=${ACCESS_TOKEN}`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
        }
        catch (e) {
            console.log(e);
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(dates_entity_1.Dates)),
    __param(3, (0, typeorm_1.InjectRepository)(workoutNum_entity_1.WorkoutNum)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        workout_service_1.WorkoutService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map