"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../entities/user.entity");
class UserRequestDto extends (0, swagger_1.PickType)(user_entity_1.User, [
    'userId',
    'nickname',
    'password',
]) {
}
exports.UserRequestDto = UserRequestDto;
//# sourceMappingURL=users.request.dto.js.map