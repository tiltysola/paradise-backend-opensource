import Koa from 'koa';

import characterService from '@/service/paradise/character';

import adminMiddleware from '@/middleware/passport/admin';

export default class {
  static method = 'get';
  static middleware = adminMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const charList = await characterService.getAllList();
    const charListObject: any = charList.map((v) => {
      const item: any = v.toJSON();
      return item;
    });
    ctx.body = ctx.code('SUCCESS', charListObject);
  }
}
