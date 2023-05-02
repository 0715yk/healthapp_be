"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const auth_module_1 = require("../auth/auth.module");
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const user_entity_1 = require("./entities/user.entity");
const dates_entity_1 = require("../workout/entities/dates.entity");
const workout_module_1 = require("../workout/workout.module");
const workoutNum_entity_1 = require("../workout/entities/workoutNum.entity");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            typeorm_1.TypeOrmModule.forFeature([dates_entity_1.Dates]),
            typeorm_1.TypeOrmModule.forFeature([workoutNum_entity_1.WorkoutNum]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1y' },
            }),
            workout_module_1.WorkoutModule,
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService],
        exports: [typeorm_1.TypeOrmModule, user_service_1.UserService],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map