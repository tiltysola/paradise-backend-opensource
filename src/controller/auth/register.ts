import { isString, regexp, uuid } from 'futo-utils';
import Koa from 'koa';

import sessionService from '@/service/passport/session';
import userService from '@/service/passport/user';
import verifyService from '@/service/passport/verify';

import { extraCodePassport } from '@/utils/errorCodeList';

import config from '@/config/passport';

import 'dotenv/config';

export default class {
  static method = 'post';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { username, password, email, emailCode } = ctx.request.body;
    if (!isString(username) || !regexp.username.test(username)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_USERNAME);
    } else if (!isString(password) || !regexp.password.test(password)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_PASSWORD);
    } else if (!isString(email) || !regexp.email.test(email)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_EMAIL);
    } else if ((!emailCode) || !regexp.code.test(emailCode)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_CODE);
    } else if (await userService.exist({ username })) {
      ctx.body = ctx.code('USERNAME_EXIST');
    } else if (await userService.exist({ email })) {
      ctx.body = ctx.code('EMAIL_EXIST');
    } else if (!await verifyService.verifyMail(email, emailCode)) {
      ctx.body = ctx.code('CODE_VALIDATE_ERROR');
    } else {
      const user = await userService.create({
        uuid: uuid(),
        username,
        password,
        email,
        emailStatus: true,
        registerEmail: email,
      });
      const userId = user.getDataValue('uuid');
      const session = await sessionService.create(userId, uuid());
      const token = session.getDataValue('token');
      ctx.cookies.set('accessToken', token, {
        path: '/',
        domain: process.env.DOMAIN,
        httpOnly: false,
        expires: new Date(Date.now() + config.sessionValidTime),
      });
      if (!user) {
        ctx.body = ctx.code('INTERNAL_ERROR');
      } else {
        ctx.body = ctx.code('SUCCESS', token);
      }
    }
  }
}
