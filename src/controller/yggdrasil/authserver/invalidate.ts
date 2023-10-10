import { regexp } from 'futo-utils';
import Koa from 'koa';

import yggdrasilService from '@/service/paradise/yggdrasil';

export default class {
  static method = 'post';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { accessToken } = ctx.request.body;
    if (!regexp.uuid.test(accessToken)) {
      ctx.status = 204;
    } else {
      await yggdrasilService.invalid(accessToken);
    }
  }
}
