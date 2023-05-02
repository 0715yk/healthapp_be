import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class UserNicknameValidation implements PipeTransform {
  private SUCEED_STATUS_CODE = 2000;
  private LINE_FEED = 10;
  private SPECIAL_CHARACTERS_REG_EXP_EXCEPT =
    /^[0-9|a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/;

  private NICKNAME_VALIDATION_MESSAGE = {
    2000: '',
    2101: '닉네임은 한글은 최소 1자 이상, 영문은 최소 2자 이상으로 설정해주세요.',
    2102: '닉네임은 한글은 최대 15자 이내, 영문은 최대 30자 이내로 설정해주세요.',
    2103: '닉네임에 특수문자를 사용할 수 없습니다.',
    2105: '닉네임에 공백을 사용할 수 없습니다.',
    // 욕설 필터링은 추후 작업(advanced)
  };

  transform(value: { nickname: string }) {
    const { nickname } = value;
    const nicknameStatusCode = this.validateUserNickname(nickname);
    const message = this.NICKNAME_VALIDATION_MESSAGE[nicknameStatusCode];
    if (nicknameStatusCode !== this.SUCEED_STATUS_CODE) {
      throw new BadRequestException(message);
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
}
