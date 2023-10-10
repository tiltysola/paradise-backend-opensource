import { regexp } from 'futo-utils';
import Koa from 'koa';

import userService from '@/service/passport/user';

import adminMiddleware from '@/middleware/passport/admin';

import { extraCodePassport } from '@/utils/errorCodeList';

export default class {
  static method = 'post';
  static middleware = adminMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { userId, username, email } = ctx.request.body;
    if (userId && !regexp.uuid.test(userId)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_USERID);
    } else if (username && !regexp.username.test(username)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_USERNAME);
    } else if (email && !regexp.email.test(email)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_EMAIL);
    } else if (!await userService.exist({ uuid: userId })) {
      ctx.body = ctx.code('USER_NOT_FOUND');
    } else if (username && await userService.exist({ username })) {
      ctx.body = ctx.code('USERNAME_EXIST');
    } else if (email && await userService.exist({ email })) {
      ctx.body = ctx.code('EMAIL_EXIST');
    } else {
      const modifyVars: any = {};
      if (username) modifyVars.username = username;
      if (email) {
        modifyVars.email = email;
        modifyVars.emailStatus = true;
      }
      await userService.modify({
        uuid: userId,
      }, modifyVars);
      ctx.body = ctx.code('SUCCESS');
    }
  }
}
