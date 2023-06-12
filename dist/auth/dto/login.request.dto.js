"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRequestDto = void 0;
const user_entity_1 = require("./../../user/entities/user.entity");
const swagger_1 = require("@nestjs/swagger");
class LoginRequestDto extends (0, swagger_1.PickType)(user_entity_1.User, [
    'userId',
    'password',
]) {
}
exports.LoginRequestDto = LoginRequestDto;
//# sourceMappingURL=login.request.dto.js.map