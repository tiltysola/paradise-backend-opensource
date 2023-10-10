import { isString, regexp } from 'futo-utils';
import Koa from 'koa';

import userService from '@/service/passport/user';

import userMiddleware from '@/middleware/passport/user';

import { extraCodePassport } from '@/utils/errorCodeList';

export default class {
  static method = 'post';
  static middleware = userMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { username } = ctx.request.body;
    if (!isString(username) || !regexp.username.test(username)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_USERNAME);
    } else if (await userService.exist({ username })) {
      ctx.body = ctx.code('USERNAME_EXIST');
    } else {
      await userService.modify({
        uuid: ctx.userId,
      }, {
        username,
      });
      ctx.body = ctx.code('SUCCESS');
    }
  }
}
