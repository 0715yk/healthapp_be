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
exports.WorkoutNum = void 0;
const workoutName_entity_1 = require("./workoutName.entity");
const dates_entity_1 = require("./dates.entity");
const typeorm_1 = require("typeorm");
let WorkoutNum = class WorkoutNum {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], WorkoutNum.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], WorkoutNum.prototype, "workoutNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], WorkoutNum.prototype, "datesId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dates_entity_1.Dates, (dates) => dates.workoutNumbers, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", dates_entity_1.Dates)
], WorkoutNum.prototype, "dates", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => workoutName_entity_1.WorkoutName, (workoutName) => workoutName.workoutNum),
    __metadata("design:type", Array)
], WorkoutNum.prototype, "workoutNames", void 0);
WorkoutNum = __decorate([
    (0, typeorm_1.Entity)()
], WorkoutNum);
exports.WorkoutNum = WorkoutNum;
//# sourceMappingURL=workoutNum.entity.js.map