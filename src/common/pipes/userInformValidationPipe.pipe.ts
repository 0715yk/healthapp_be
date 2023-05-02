import { UserRequestDto } from '../../user/dto/users.request.dto';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class UserInformValidationPipe implements PipeTransform {
  private SUCEED_STATUS_CODE = 2000;
  private LINE_FEED = 10;
  private SPECIAL_CHARACTERS_REG_EXP_EXCEPT =
    /^[0-9|a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/;

  private ID_VALIDATION_MESSAGE = {
    2000: '',
    2101: '아이디는 최소 2자 이상, 영문은 최소 4자 이상으로 설정해주세요.',
    2102: '아이디는 한글은 최대 15자 이내, 영문은 최대 30자 이내로 설정해주세요.',
    2103: '아이디에 특수문자를 사용할 수 없습니다.',
    2104: '동일한 아이디가 존재합니다.',
    2105: '아이디에 공백을 사용할 수 없습니다.',
    // 욕설 필터링은 추후 작업(advanced)
  };

  private PWD_VALIDATION_MESSAGE = {
    2000: '',
    2101: '비밀번호는 최소 6자 이상, 최대 30자 이내로 작성해주세요.',
    2105: '비밀번호에 공백을 사용할 수 없습니다.',
  };

  private NICKNAME_VALIDATION_MESSAGE = {
    2000: '',
    2101: '닉네임은 한글은 최소 1자 이상, 영문은 최소 2자 이상으로 설정해주세요.',
    2102: '닉네임은 한글은 최대 15자 이내, 영문은 최대 30자 이내로 설정해주세요.',
    2103: '닉네임에 특수문자를 사용할 수 없습니다.',
    2105: '닉네임에 공백을 사용할 수 없습니다.',
    // 욕설 필터링은 추후 작업(advanced)
  };

  transform(value: UserRequestDto) {
    const { userId, password, nickname } = value;

    const result = this.validateSignupForm(userId, password, nickname);
    if (result !== '') {
      throw new BadRequestException(result);
    } else {
      return value;
    }
  }

  private getByteLength(decimal: number) {
    return decimal >> 7 || this.LINE_FEED === decimal ? 2 : 1;
  }

  private getByte(str: string) {
    return str
      .split('')
      .map((s) => s.charCodeAt(0))
      .reduce(
        (prev, unicodeDecimalValue) =>
          prev + this.getByteLength(unicodeDecimalValue),
        0,
      );
  }

  private checkByteLength(param: string, min: number, max: number) {
    if (this.getByte(param) >= min && this.getByte(param) <= max) {
      return this.SUCEED_STATUS_CODE;
    } else if (this.getByte(param) > max) {
      return 2102;
    } else {
      return 2101;
    }
  }

  // -- 특수 문자 관련 처리 로직 --
  private checkSpecialCharacters(param: string) {
    if (this.SPECIAL_CHARACTERS_REG_EXP_EXCEPT.test(param)) {
      return this.SUCEED_STATUS_CODE;
    } else {
      return 2103;
    }
  }

  // -- 공백 관련 처리 로직 --
  private checkNull(param: string) {
    if (param.indexOf('　') === -1 && param.indexOf(' ') === -1) {
      return this.SUCEED_STATUS_CODE;
    } else {
      return 2105;
    }
  }

  private validateUserId(id: string) {
    const lengthValidationCode = this.checkByteLength(id, 4, 30);
    const specialCharacterValidationCode = this.checkSpecialCharacters(id);
    const nullValidationCode = this.checkNull(id);

    if (nullValidationCode !== this.SUCEED_STATUS_CODE) {
      return nullValidationCode;
    }
    if (specialCharacterValidationCode !== this.SUCEED_STATUS_CODE) {
      return specialCharacterValidationCode;
    } else if (lengthValidationCode !== this.SUCEED_STATUS_CODE) {
      return lengthValidationCode;
    } else {
      return this.SUCEED_STATUS_CODE;
    }
  }

  private checkPureLength(param: string, min: number, max: number) {
    if (param.length >= min && param.length <= max) {
      return this.SUCEED_STATUS_CODE;
    } else {
      return 2101;
    }
  }

  private validateUserPwd(pwd: string) {
    const lengthValidationCode = this.checkPureLength(pwd, 6, 30);
    const nullValidationCode = this.checkNull(pwd);

    if (nullValidationCode !== this.SUCEED_STATUS_CODE) {
      return nullValidationCode;
    } else if (lengthValidationCode !== this.SUCEED_STATUS_CODE) {
      return lengthValidationCode;
    } else {
      return this.SUCEED_STATUS_CODE;
    }
  }

  private validateUserNickname(nickname: string) {
    const lengthValidationCode = this.checkByteLength(nickname, 2, 30);
    const specialCharacterValidationCode =
      this.checkSpecialCharacters(nickname);
    const nullValidationCode = this.checkNull(nickname);

    if (nullValidationCode !== this.SUCEED_STATUS_CODE) {
      return nullValidationCode;
    } else if (specialCharacterValidationCode !== this.SUCEED_STATUS_CODE) {
      return specialCharacterValidationCode;
    } else if (lengthValidationCode !== this.SUCEED_STATUS_CODE) {
      return lengthValidationCode;
    } else {
      return this.SUCEED_STATUS_CODE;
    }
  }

  private validateSignupForm(id: string, pwd: string, nickname: string) {
    const idStatusCode = this.validateUserId(id);
    const pwdStatusCode = this.validateUserPwd(pwd);
    const nicknameStatusCode = this.validateUserNickname(nickname);

    if (idStatusCode !== this.SUCEED_STATUS_CODE) {
      return this.ID_VALIDATION_MESSAGE[idStatusCode];
    } else if (pwdStatusCode !== this.SUCEED_STATUS_CODE) {
      return this.PWD_VALIDATION_MESSAGE[pwdStatusCode];
    } else if (nicknameStatusCode !== this.SUCEED_STATUS_CODE) {
      return this.NICKNAME_VALIDATION_MESSAGE[nicknameStatusCode];
    } else {
      return '';
    }
  }
}
