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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutName = void 0;
const workoutNum_entity_1 = require("./workoutNum.entity");
const typeorm_1 = require("typeorm");
const workout_entity_1 = require("./workout.entity");
let WorkoutName = class WorkoutName {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], WorkoutName.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], WorkoutName.prototype, "workoutNumId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WorkoutName.prototype, "workoutName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => workoutNum_entity_1.WorkoutNum, (workoutNum) => workoutNum.workoutNames, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", workoutNum_entity_1.WorkoutNum)
], WorkoutName.prototype, "workoutNum", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => workout_entity_1.Workout, (workout) => workout.workoutName),
    __metadata("design:type", Array)
], WorkoutName.prototype, "workouts", void 0);
WorkoutName = __decorate([
    (0, typeorm_1.Entity)()
], WorkoutName);
exports.WorkoutName = WorkoutName;
//# sourceMappingURL=workoutName.entity.js.map