import { isString, Logger, regexp } from 'futo-utils';
import Koa from 'koa';

import verifyService from '@/service/passport/verify';

import { extraCodePassport } from '@/utils/errorCodeList';

export default class {
  static method = 'post';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { email } = ctx.request.body;
    const { ip } = ctx.request;
    if (!isString(email) || !regexp.email.test(email)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_EMAIL);
    } else if (!await verifyService.ipMail(email, ip)) {
      ctx.body = ctx.code('CODE_LIMIT_ERROR');
    } else {
      const sms = await verifyService.latestMail(email);
      let code = '000000';
      if (sms) {
        code = sms.getDataValue('code');
      } else {
        code = Math.floor(100000 + Math.random() * 900000).toString();
        await verifyService.createMail(email, code, ip);
      }
      try {
        await verifyService.sendMail(email, code);
        ctx.body = ctx.code('SUCCESS');
      } catch (err: any) {
        if (err.code === 'EENVELOPE') {
          ctx.body = ctx.code('CODE_SEND_FAILED');
        } else {
          Logger.critical('[AcquireMail]', err);
          ctx.body = ctx.code('INTERNAL_ERROR');
        }
      }
    }
  }
}
