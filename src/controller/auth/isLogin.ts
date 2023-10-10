import Koa from 'koa';

export default class {
  static method = 'get';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    if (!ctx.userId) {
      ctx.body = ctx.code('USER_NOT_LOGIN');
    } else {
      ctx.body = ctx.code('SUCCESS');
    }
  }
}
