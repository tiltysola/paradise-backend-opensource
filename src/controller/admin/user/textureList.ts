import { isString, regexp } from 'futo-utils';
import Koa from 'koa';

import textureService from '@/service/paradise/texture';

import adminMiddleware from '@/middleware/passport/admin';

import { extraCodeParadise } from '@/utils/errorCodeList';
import extraRegexp from '@/utils/extraRegexp';

export default class {
  static method = 'get';
  static middleware = adminMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { userId, type } = ctx.request.query;
    if (!isString(userId) || !regexp.uuid.test(userId)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_USERID);
    } else if (!extraRegexp.type(type)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_TYPE);
    } else {
      const textureList = (await textureService.getUserList(userId, type)).map((v) => v.toJSON());
      ctx.body = ctx.code('SUCCESS', textureList.map((v: any) => {
        const item = v;
        delete item.userId;
        return item;
      }));
    }
  }
}
