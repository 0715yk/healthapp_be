"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("./user/user.module");
const common_1 = require("@nestjs/common");
const logger_middleware_1 = require("./common/middlewares/logger.middleware");
const auth_module_1 = require("./auth/auth.module");
const user_entity_1 = require("./user/entities/user.entity");
const workout_module_1 = require("./workout/workout.module");
let AppModule = class AppModule {
    constructor() {
        this.isDev = process.env.MODE === 'dev' ? true : false;
    }
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.MYSQL_HOST,
                port: parseInt(process.env.MYSQL_PORT),
                username: 'bravehong',
                password: process.env.MYSQL_PASSWORD,
                database: 'healthapp',
                entities: [user_entity_1.User],
                autoLoadEntities: true,
                synchronize: false,
            }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            workout_module_1.WorkoutModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map