import Koa from 'koa';

import sessionService from '@/service/passport/session';

export default async (
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
  next: Koa.Next,
) => {
  const accessToken =
    ctx.cookies.get('accessToken') ||
    ctx.request.body?.accessToken ||
    ctx.request.query?.accessToken ||
    '';
  if (accessToken) {
    ctx.accessToken = accessToken;
    ctx.userId = await sessionService.getUser(accessToken);
    if (ctx.userId) {
      sessionService.refresh(accessToken);
    }
  }
  await next();
};
