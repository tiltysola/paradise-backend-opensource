import Koa from 'koa';

import sessionService from '@/service/passport/session';

import userMiddleware from '@/middleware/passport/user';

export default class {
  static method = 'post';
  static middleware = userMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    await sessionService.invalid(ctx.accessToken || '');
    ctx.body = ctx.code('SUCCESS');
    ctx.cookies.set('accessToken', undefined);
  }
}
