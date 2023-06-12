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
exports.WorkoutService = void 0;
const user_entity_1 = require("../user/entities/user.entity");
const workoutNum_entity_1 = require("./entities/workoutNum.entity");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const dates_entity_1 = require("./entities/dates.entity");
const typeorm_2 = require("typeorm");
const workoutName_entity_1 = require("./entities/workoutName.entity");
const workout_entity_1 = require("./entities/workout.entity");
let WorkoutService = class WorkoutService {
    constructor(dataSource, datesRepository, workoutNumRepository, workoutNameRepository, workoutRepository, jwtService) {
        this.dataSource = dataSource;
        this.datesRepository = datesRepository;
        this.workoutNumRepository = workoutNumRepository;
        this.workoutNameRepository = workoutNameRepository;
        this.workoutRepository = workoutRepository;
        this.jwtService = jwtService;
    }
    async getLatestWorkout(id) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const dates = await this.datesRepository.find({
                where: {
                    userId: id,
                },
                order: {
                    id: {
                        direction: 'DESC',
                    },
                },
            });
            const latestDatesId = dates[0].id;
            const latestDate = dates[0].date;
            const workoutNums = await this.workoutNumRepository.find({
                where: {
                    datesId: latestDatesId,
                },
                order: {
                    id: {
                        direction: 'DESC',
                    },
                },
            });
            const latestWorkoutNumId = workoutNums[0].id;
            const data = await this.dataSource
                .getRepository(workoutNum_entity_1.WorkoutNum)
                .createQueryBuilder('workoutNum')
                .leftJoinAndSelect('workoutNum.workoutNames', 'workoutName')
                .leftJoinAndSelect('workoutName.workouts', 'workout')
                .where('workoutNum.id = :id', { id: latestWorkoutNumId })
                .getMany();
            return Object.assign(Object.assign({}, data), { latestDate });
        }
        catch (err) {
            console.error(err);
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    async create(userId, body) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { date, workouts } = body;
            const existsOrNot = await this.datesRepository.findOne({
                where: { userId, date },
            });
            if (existsOrNot) {
                await this.datesRepository.update({ id: existsOrNot.id }, { workoutCount: existsOrNot.workoutCount + 1 });
                const workoutNumId = existsOrNot.id;
                const workoutNumObj = await this.workoutNumRepository.create({
                    datesId: workoutNumId,
                    workoutNumber: existsOrNot.workoutCount + 1,
                });
                const workoutNumResult = await this.workoutNumRepository.save(workoutNumObj);
                const resultId = workoutNumResult === null || workoutNumResult === void 0 ? void 0 : workoutNumResult.id;
                if (resultId) {
                    for (const workoutArr of workouts) {
                        const workoutNumObj = await this.workoutNameRepository.create({
                            workoutNumId: resultId,
                            workoutName: workoutArr[0].name,
                        });
                        const workoutNumResult = await this.workoutNameRepository.save(workoutNumObj);
                        const workoutNumResultId = workoutNumResult.id;
                        if (workoutNumResultId) {
                            for (const workout of workoutArr) {
                                const workoutNumObj = await this.workoutRepository.create({
                                    workoutNameId: workoutNumResultId,
                                    set: workout.set,
                                    reps: workout.reps,
                                    kg: workout.kg,
                                    bestSet: workout.bestSet,
                                });
                                await this.workoutRepository.save(workoutNumObj);
                            }
                        }
                    }
                }
            }
            else {
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
                const workoutNumResult = await this.workoutNumRepository.save(workoutNumObj);
                const resultId = workoutNumResult === null || workoutNumResult === void 0 ? void 0 : workoutNumResult.id;
                if (resultId) {
                    for (const workoutArr of workouts) {
                        const workoutNumObj = await this.workoutNameRepository.create({
                            workoutNumId: resultId,
                            workoutName: workoutArr[0].name,
                        });
                        const workoutNumResult = await this.workoutNameRepository.save(workoutNumObj);
                        const workoutNumResultId = workoutNumResult.id;
                        if (workoutNumResultId) {
                            for (const workout of workoutArr) {
                                const workoutNumObj = await this.workoutRepository.create({
                                    workoutNameId: workoutNumResultId,
                                    set: workout.set,
                                    reps: workout.reps,
                                    kg: workout.kg,
                                    bestSet: workout.bestSet,
                                });
                                await this.workoutRepository.save(workoutNumObj);
                            }
                        }
                    }
                }
                return workoutNumResult;
            }
        }
        catch (err) {
            console.error(err);
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    findAll() {
        return `This action returns all workout`;
    }
    async deleteWorkoutNum(datesId, workoutNum) {
        const response = await this.workoutNumRepository.findBy({
            datesId,
        });
        const workoutNumLen = response.length;
        if (workoutNumLen === 1) {
            this.datesRepository.delete({
                id: datesId,
            });
        }
        else {
            this.workoutNumRepository.delete({
                id: workoutNum,
            });
        }
    }
    async deleteWorkoutName(id, workoutNumId, datesId) {
        const response = await this.workoutNameRepository.findBy({
            workoutNumId,
        });
        if (response.length === 1) {
            const response = await this.deleteWorkoutNum(datesId, workoutNumId);
        }
        else {
            const response = this.workoutNameRepository.delete({
                id,
            });
        }
    }
    async deleteWorkout(id, datesId, workoutNumId, workoutNameId) {
        const response = await this.workoutRepository.findBy({
            workoutNameId,
        });
        if (response.length === 1) {
            await this.deleteWorkoutName(workoutNameId, workoutNumId, datesId);
        }
        else {
            this.workoutRepository.delete({
                id,
            });
        }
    }
    async updateWorkoutSet(id, body) {
        try {
            const response = await this.workoutRepository.update({
                id,
            }, Object.assign({}, body));
        }
        catch (_a) { }
    }
    async updateWorkoutName(id, workoutName) {
        try {
            const response = await this.workoutNameRepository.update({
                id,
            }, {
                workoutName,
            });
        }
        catch (_a) { }
    }
    async findWorkouts(id, date) {
        var _a, _b;
        const data = await this.dataSource
            .getRepository(user_entity_1.User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.dates', 'date')
            .leftJoinAndSelect('date.workoutNumbers', 'workoutNum')
            .leftJoinAndSelect('workoutNum.workoutNames', 'workoutName')
            .leftJoinAndSelect('workoutName.workouts', 'workout')
            .where('date.userId = :id', { id: id })
            .andWhere('date.date = :date', { date })
            .getMany();
        const result = (_b = (_a = data[0]) === null || _a === void 0 ? void 0 : _a.dates[0]) === null || _b === void 0 ? void 0 : _b.workoutNumbers;
        return result;
    }
};
WorkoutService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(dates_entity_1.Dates)),
    __param(2, (0, typeorm_1.InjectRepository)(workoutNum_entity_1.WorkoutNum)),
    __param(3, (0, typeorm_1.InjectRepository)(workoutName_entity_1.WorkoutName)),
    __param(4, (0, typeorm_1.InjectRepository)(workout_entity_1.Workout)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], WorkoutService);
exports.WorkoutService = WorkoutService;
//# sourceMappingURL=workout.service.js.map