import Koa from 'koa';

import userService from '@/service/passport/user';

import userMiddleware from '@/middleware/passport/user';

export default class {
  static method = 'get';
  static middleware = userMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const user = await userService.getUser({
      uuid: ctx.userId,
    });
    if (!user) {
      ctx.body = ctx.code('USER_NOT_FOUND');
    } else {
      const userObject: any = user.toJSON();
      delete userObject.password;
      ctx.body = ctx.code('SUCCESS', userObject);
    }
  }
}
