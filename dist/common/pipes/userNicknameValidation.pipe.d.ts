import { PipeTransform } from '@nestjs/common';
export declare class UserNicknameValidation implements PipeTransform {
    private SUCEED_STATUS_CODE;
    private LINE_FEED;
    private SPECIAL_CHARACTERS_REG_EXP_EXCEPT;
    private NICKNAME_VALIDATION_MESSAGE;
    transform(value: {
        nickname: string;
    }): {
        nickname: string;
    };
    private getByteLength;
    private getByte;
    private checkByteLength;
    private checkSpecialCharacters;
    private checkNull;
    private validateUserNickname;
}
