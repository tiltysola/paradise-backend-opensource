import Koa from 'koa';

import textureService from '@/service/paradise/texture';

import adminMiddleware from '@/middleware/passport/admin';

export default class {
  static method = 'get';
  static middleware = adminMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const textList = await textureService.getAllList();
    const textListObject: any = textList.map((v) => {
      const item: any = v.toJSON();
      return item;
    });
    ctx.body = ctx.code('SUCCESS', textListObject);
  }
}
