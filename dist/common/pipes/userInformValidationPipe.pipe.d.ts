import { UserRequestDto } from '../../user/dto/users.request.dto';
import { PipeTransform } from '@nestjs/common';
export declare class UserInformValidationPipe implements PipeTransform {
    private SUCEED_STATUS_CODE;
    private LINE_FEED;
    private SPECIAL_CHARACTERS_REG_EXP_EXCEPT;
    private ID_VALIDATION_MESSAGE;
    private PWD_VALIDATION_MESSAGE;
    private NICKNAME_VALIDATION_MESSAGE;
    transform(value: UserRequestDto): UserRequestDto;
    private getByteLength;
    private getByte;
    private checkByteLength;
    private checkSpecialCharacters;
    private checkNull;
    private validateUserId;
    private checkPureLength;
    private validateUserPwd;
    private validateUserNickname;
    private validateSignupForm;
}
