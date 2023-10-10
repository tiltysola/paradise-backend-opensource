import { isString, regexp } from 'futo-utils';
import Koa from 'koa';

import sessionService from '@/service/passport/session';

import { extraCodePassport } from '@/utils/errorCodeList';

import config from '@/config/passport';

import 'dotenv/config';

export default class {
  static method = 'post';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { accessToken } = ctx.request.body;
    if (!isString(accessToken) && !regexp.uuid.test(accessToken)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_ACCESSTOKEN);
    } else {
      ctx.userId = await sessionService.getUser(accessToken);
      if (!ctx.userId) {
        ctx.body = ctx.code('USER_NOT_LOGIN');
      } else {
        ctx.cookies.set('accessToken', accessToken, {
          path: '/',
          domain: process.env.DOMAIN,
          httpOnly: false,
          expires: new Date(Date.now() + config.sessionValidTime),
        });
        ctx.body = ctx.code('SUCCESS', accessToken);
      }
    }
  }
}
