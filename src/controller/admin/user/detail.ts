import { regexp } from 'futo-utils';
import Koa from 'koa';

import userService from '@/service/passport/user';

import adminMiddleware from '@/middleware/passport/admin';

import { extraCodePassport } from '@/utils/errorCodeList';

export default class {
  static method = 'get';
  static middleware = adminMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { userId } = ctx.request.body;
    if (!userId || !regexp.uuid.test(userId)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_USERID);
    } else {
      const user = await userService.getUser({
        uuid: userId,
      });
      if (!user) {
        ctx.body = ctx.code('USER_NOT_FOUND');
      } else {
        const userObject: any = user.toJSON();
        delete userObject.password;
        ctx.body = ctx.code('SUCCESS', userObject);
      }
    }
  }
}
