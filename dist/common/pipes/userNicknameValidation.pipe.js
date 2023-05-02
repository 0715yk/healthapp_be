"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNicknameValidation = void 0;
const common_1 = require("@nestjs/common");
let UserNicknameValidation = class UserNicknameValidation {
    constructor() {
        this.SUCEED_STATUS_CODE = 2000;
        this.LINE_FEED = 10;
        this.SPECIAL_CHARACTERS_REG_EXP_EXCEPT = /^[0-9|a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/;
        this.NICKNAME_VALIDATION_MESSAGE = {
            2000: '',
            2101: '닉네임은 한글은 최소 1자 이상, 영문은 최소 2자 이상으로 설정해주세요.',
            2102: '닉네임은 한글은 최대 15자 이내, 영문은 최대 30자 이내로 설정해주세요.',
            2103: '닉네임에 특수문자를 사용할 수 없습니다.',
            2105: '닉네임에 공백을 사용할 수 없습니다.',
        };
    }
    transform(value) {
        const { nickname } = value;
        const nicknameStatusCode = this.validateUserNickname(nickname);
        const message = this.NICKNAME_VALIDATION_MESSAGE[nicknameStatusCode];
        if (nicknameStatusCode !== this.SUCEED_STATUS_CODE) {
            throw new common_1.BadRequestException(message);
        }
        else {
            return value;
        }
    }
    getByteLength(decimal) {
        return decimal >> 7 || this.LINE_FEED === decimal ? 2 : 1;
    }
    getByte(str) {
        return str
            .split('')
            .map((s) => s.charCodeAt(0))
            .reduce((prev, unicodeDecimalValue) => prev + this.getByteLength(unicodeDecimalValue), 0);
    }
    checkByteLength(param, min, max) {
        if (this.getByte(param) >= min && this.getByte(param) <= max) {
            return this.SUCEED_STATUS_CODE;
        }
        else if (this.getByte(param) > max) {
            return 2102;
        }
        else {
            return 2101;
        }
    }
    checkSpecialCharacters(param) {
        if (this.SPECIAL_CHARACTERS_REG_EXP_EXCEPT.test(param)) {
            return this.SUCEED_STATUS_CODE;
        }
        else {
            return 2103;
        }
    }
    checkNull(param) {
        if (param.indexOf('　') === -1 && param.indexOf(' ') === -1) {
            return this.SUCEED_STATUS_CODE;
        }
        else {
            return 2105;
        }
    }
    validateUserNickname(nickname) {
        const lengthValidationCode = this.checkByteLength(nickname, 2, 30);
        const specialCharacterValidationCode = this.checkSpecialCharacters(nickname);
        const nullValidationCode = this.checkNull(nickname);
        if (nullValidationCode !== this.SUCEED_STATUS_CODE) {
            return nullValidationCode;
        }
        else if (specialCharacterValidationCode !== this.SUCEED_STATUS_CODE) {
            return specialCharacterValidationCode;
        }
        else if (lengthValidationCode !== this.SUCEED_STATUS_CODE) {
            return lengthValidationCode;
        }
        else {
            return this.SUCEED_STATUS_CODE;
        }
    }
};
UserNicknameValidation = __decorate([
    (0, common_1.Injectable)()
], UserNicknameValidation);
exports.UserNicknameValidation = UserNicknameValidation;
//# sourceMappingURL=userNicknameValidation.pipe.js.map