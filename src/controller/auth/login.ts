import { isString, regexp, uuid } from 'futo-utils';
import Koa from 'koa';

import attemptService from '@/service/passport/attempt';
import sessionService from '@/service/passport/session';
import userService from '@/service/passport/user';

import { extraCodePassport } from '@/utils/errorCodeList';

import config from '@/config/passport';

import 'dotenv/config';

export default class {
  static method = 'post';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { account, password } = ctx.request.body;
    if (!account || (!regexp.username.test(account) && !regexp.email.test(account))) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_USERNAME);
    } else if (!isString(password)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_PASSWORD);
    } else {
      let user;
      if (regexp.email.test(account)) {
        user = await userService.getUser({ email: account });
      } else {
        user = await userService.getUser({ username: account });
      }
      if (!user) {
        ctx.body = ctx.code('USER_NOT_FOUND');
      } else {
        const userId = user.getDataValue('uuid');
        const banned = user.getDataValue('banned');
        if (banned) {
          ctx.body = ctx.code('USER_BANNED', {
            errorMessage: `账户被封禁，理由：${user.getDataValue('banReason')}`,
          });
        } else {
          const attemptCount = await attemptService.getAttempt(userId, false, 'LOGIN');
          if (attemptCount >= config.attempt.maxTimes) {
            ctx.body = ctx.code('USER_ATTEMPT_LIMIT_ERROR');
          } else {
            const success = !!(await userService.validate({ uuid: user.getDataValue('uuid') }, password));
            attemptService.create(userId, success, 'LOGIN');
            if (!success) {
              ctx.body = ctx.code('USER_PASSWORD_ERROR');
            } else {
              const session = await sessionService.create(userId, uuid());
              const token = session.getDataValue('token');
              ctx.cookies.set('accessToken', token, {
                httpOnly: false,
                expires: new Date(Date.now() + config.sessionValidTime),
              });
              ctx.body = ctx.code('SUCCESS', token);
            }
          }
        }
      }
    }
  }
}
