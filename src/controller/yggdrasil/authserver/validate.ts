import { regexp } from 'futo-utils';
import Koa from 'koa';

import yggdrasilService from '@/service/paradise/yggdrasil';

import { extraCodeParadise } from '@/utils/errorCodeList';

export default class {
  static method = 'post';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { accessToken, clientToken: ctoken } = ctx.request.body;
    if (!regexp.uuid.test(accessToken)) {
      ctx.status = 403;
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_ACCESSTOKEN);
    } else {
      const clientToken = await yggdrasilService.getClientToken(accessToken);
      if (!clientToken) {
        ctx.status = 403;
        ctx.body = ctx.code('ACCESS_TOKEN_NOT_FOUND');
      } else if (ctoken && ctoken !== clientToken) {
        ctx.status = 403;
        ctx.body = ctx.code('CLIENT_TOKEN_NOT_MATCH');
      } else {
        ctx.status = 204;
      }
    }
  }
}
