import Koa from 'koa';

import characterService from '@/service/paradise/character';

import userMiddleware from '@/middleware/passport/user';

export default class {
  static method = 'get';
  static middleware = userMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const characterList = (await characterService.getUserList(ctx.userId)).map((v) => v.toJSON());
    ctx.body = ctx.code('SUCCESS', characterList);
  }
}
