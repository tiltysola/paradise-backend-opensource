import { isString, regexp } from 'futo-utils';
import Koa from 'koa';

import attemptService from '@/service/passport/attempt';
import userService from '@/service/passport/user';

import userMiddleware from '@/middleware/passport/user';

import { extraCodePassport } from '@/utils/errorCodeList';

export default class {
  static method = 'post';
  static middleware = userMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { password } = ctx.request.body;
    if (!isString(password) || !regexp.password.test(password)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_PASSWORD);
    } else {
      await userService.modify({ uuid: ctx.userId }, { password });
      await attemptService.clearAttempts(ctx.userId);
      ctx.body = ctx.code('SUCCESS');
    }
  }
}
