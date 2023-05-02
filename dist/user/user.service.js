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
            const dates = await this.datesRepository.find({ where: { userId: id } });
            dates.forEach(async (date) => {
                const dateId = date.id;
                const workoutNums = await this.workoutNumRepository.find({
                    where: { datesId: dateId },
                });
                workoutNums.forEach(async (workoutNum) => {
                    await this.workoutService.deleteWorkoutNum(dateId, workoutNum.id);
                });
                await this.datesRepository.delete({ id: dateId });
            });
            const result = await this.userRepository.delete({ id: id });
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