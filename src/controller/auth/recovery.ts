import { isString, regexp } from 'futo-utils';
import Koa from 'koa';

import attemptService from '@/service/passport/attempt';
import userService from '@/service/passport/user';
import verifyService from '@/service/passport/verify';

import { extraCodePassport } from '@/utils/errorCodeList';

export default class {
  static method = 'post';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { email, password, emailCode } = ctx.request.body;
    if (!isString(email) || !regexp.email.test(email)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_EMAIL);
    } else if (!isString(password) || !regexp.password.test(password)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_PASSWORD);
    } else if ((!emailCode) || !regexp.code.test(emailCode)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_CODE);
    } else if (!await verifyService.verifyMail(email, emailCode)) {
      ctx.body = ctx.code('CODE_VALIDATE_ERROR');
    } else {
      const user = await userService.getUser({ email });
      if (!user) {
        ctx.body = ctx.code('USER_NOT_FOUND');
      } else {
        const userId = user.getDataValue('uuid');
        await userService.modify({ uuid: userId }, { password });
        await attemptService.clearAttempts(userId);
        ctx.body = ctx.code('SUCCESS');
      }
    }
  }
}
