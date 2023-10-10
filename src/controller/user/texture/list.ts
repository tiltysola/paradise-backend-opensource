import Koa from 'koa';

import textureService from '@/service/paradise/texture';

import userMiddleware from '@/middleware/passport/user';

import { extraCodeParadise } from '@/utils/errorCodeList';
import extraRegexp from '@/utils/extraRegexp';

export default class {
  static method = 'get';
  static middleware = userMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { type } = ctx.request.query;
    if (!extraRegexp.type(type)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_TYPE);
    } else {
      const textureList = (await textureService.getUserList(ctx.userId, type)).map((v) => v.toJSON());
      ctx.body = ctx.code('SUCCESS', textureList);
    }
  }
}
