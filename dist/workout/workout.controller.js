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
exports.WorkoutController = void 0;
const jwt_1 = require("@nestjs/jwt");
const jwt_guard_1 = require("../auth/jwt/jwt.guard");
const common_1 = require("@nestjs/common");
const workout_service_1 = require("./workout.service");
let WorkoutController = class WorkoutController {
    constructor(workoutService, jwtService) {
        this.workoutService = workoutService;
        this.jwtService = jwtService;
    }
    create(req, body) {
        var _a;
        const pureToken = (_a = req === null || req === void 0 ? void 0 : req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.substring(7);
        const response = this.jwtService.decode(pureToken);
        const id = response.sub;
        return this.workoutService.create(id, body);
    }
    deleteWorkoutNum(body) {
        return this.workoutService.deleteWorkoutNum(body.datesId, body.workoutNum);
    }
    deleteWorkoutName(body) {
        return this.workoutService.deleteWorkoutName(body.id, body.workoutNumId, body.datesId);
    }
    deleteWorkout(body) {
        return this.workoutService.deleteWorkout(body.id, body.datesId, body.workoutNumId, body.workoutNameId);
    }
    findOne(req, date) {
        var _a;
        const pureToken = (_a = req === null || req === void 0 ? void 0 : req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.substring(7);
        const response = this.jwtService.decode(pureToken);
        const id = response.sub;
        return this.workoutService.findWorkouts(id, date);
    }
    updateWorkoutSet(id, body) {
        return this.workoutService.updateWorkoutSet(id, body);
    }
    updateWorkoutName(id, workoutName) {
        return this.workoutService.updateWorkoutName(id, workoutName);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WorkoutController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)('/workoutNum'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkoutController.prototype, "deleteWorkoutNum", null);
__decorate([
    (0, common_1.Delete)('/workoutName'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkoutController.prototype, "deleteWorkoutName", null);
__decorate([
    (0, common_1.Delete)('/workout'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkoutController.prototype, "deleteWorkout", null);
__decorate([
    (0, common_1.Get)('/:date'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WorkoutController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('workoutSet/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], WorkoutController.prototype, "updateWorkoutSet", null);
__decorate([
    (0, common_1.Patch)('workoutName/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('workoutName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], WorkoutController.prototype, "updateWorkoutName", null);
WorkoutController = __decorate([
    (0, common_1.Controller)('workout'),
    __metadata("design:paramtypes", [workout_service_1.WorkoutService,
        jwt_1.JwtService])
], WorkoutController);
exports.WorkoutController = WorkoutController;
//# sourceMappingURL=workout.controller.js.map