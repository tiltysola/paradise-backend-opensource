import { isString, regexp } from 'futo-utils';
import Koa from 'koa';

import characterService from '@/service/paradise/character';

import adminMiddleware from '@/middleware/passport/admin';

import { extraCodeParadise } from '@/utils/errorCodeList';

export default class {
  static method = 'get';
  static middleware = adminMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { userId } = ctx.request.query;
    if (!isString(userId) || !regexp.uuid.test(userId)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_USERID);
    } else {
      const characterList = (await characterService.getUserList(userId)).map((v) => v.toJSON());
      ctx.body = ctx.code('SUCCESS', characterList.map((v: any) => {
        const item = v;
        delete item.userId;
        return item;
      }));
    }
  }
}
