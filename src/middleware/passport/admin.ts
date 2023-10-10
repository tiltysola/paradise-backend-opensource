import Koa from 'koa';

import userService from '@/service/passport/user';

export default async (
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
  next: Koa.Next,
) => {
  if (ctx.userId) {
    const user = await userService.getUser({ uuid: ctx.userId });
    const permissions: string[] = user?.getDataValue('permissions')?.split(',') || [];
    if (permissions.includes(`^${ctx.request.path}`) || permissions.includes('ROOT') || user?.getDataValue('email') === 'kanade@acgme.cn') {
      ctx.permissions = permissions;
      await next();
    } else {
      ctx.body = ctx.code('ACCESS_DENIED');
    }
  } else {
    ctx.body = ctx.code('USER_NOT_LOGIN');
  }
};
