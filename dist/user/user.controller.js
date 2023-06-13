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
exports.UserController = void 0;
const users_request_dto_1 = require("./dto/users.request.dto");
const user_service_1 = require("./user.service");
const user_decorator_1 = require("../common/decorators/user.decorator");
const auth_service_1 = require("../auth/auth.service");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const login_request_dto_1 = require("../auth/dto/login.request.dto");
const jwt_guard_1 = require("../auth/jwt/jwt.guard");
const userInformValidationPipe_pipe_1 = require("../common/pipes/userInformValidationPipe.pipe");
const userNicknameValidation_pipe_1 = require("../common/pipes/userNicknameValidation.pipe");
let UserController = class UserController {
    constructor(userSerivce, authService) {
        this.userSerivce = userSerivce;
        this.authService = authService;
    }
    getCurrentUser(user) {
        return user;
    }
    async signUp(body) {
        const response = await this.userSerivce.signUp(body);
        return response;
    }
    logIn(data) {
        const response = this.authService.jwtLogin(data);
        return response;
    }
    deleteUser(req) {
        this.userSerivce.deleteUser(req.headers['authorization']);
    }
    updateNickname(req, body) {
        const nickname = body.nickname;
        this.userSerivce.updateNickname(req.headers['authorization'], nickname);
    }
    async kakaoLogin(res, query) {
        const { code } = query;
        const response = await this.userSerivce.socialLogin(code);
        if (response === null || response === void 0 ? void 0 : response.jwtToken) {
            return res.redirect(`${process.env.FE_URL}main?code=${response.jwtToken}`);
        }
        else {
            return res.redirect(`${process.env.CANCEL_REDIRECT_URL}?type=cancel`);
        }
    }
    async kakaoLogout(req) {
        await this.userSerivce.kakaoLogout(req.headers['authorization']);
    }
    async googleLogin(res, query) {
        const { code } = query;
        const response = await this.userSerivce.socialLoginGoogle(code);
        if (response === null || response === void 0 ? void 0 : response.jwtToken) {
            return res.redirect(`${process.env.FE_URL}main?code=${response.jwtToken}`);
        }
        else {
            return res.redirect(`${process.env.CANCEL_REDIRECT_URL}?type=cancel`);
        }
    }
    async googleLogout(req) {
        await this.userSerivce.googleLogout(req.headers['authorization']);
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 401,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '성공!',
        type: login_request_dto_1.LoginRequestDto,
    }),
    (0, swagger_1.ApiOperation)({ summary: '현재 유저 정보 가져오기' }),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getCurrentUser", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Server Error...',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '성공!',
    }),
    (0, swagger_1.ApiOperation)({ summary: '회원가입' }),
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(userInformValidationPipe_pipe_1.UserInformValidationPipe),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_request_dto_1.UserRequestDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signUp", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '이메일과 비밀번호를 확인해주세요.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '성공!',
        type: login_request_dto_1.LoginRequestDto,
    }),
    (0, swagger_1.ApiOperation)({ summary: '로그인' }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_request_dto_1.LoginRequestDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "logIn", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '성공!',
    }),
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '성공!',
    }),
    (0, common_1.Patch)('nickname'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(userNicknameValidation_pipe_1.UserNicknameValidation),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateNickname", null);
__decorate([
    (0, common_1.Get)('kakao'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "kakaoLogin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('kakaoLogout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "kakaoLogout", null);
__decorate([
    (0, common_1.Get)('google'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('googleLogout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "googleLogout", null);
UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map