import Koa from 'koa';

export default async (
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
  next: Koa.Next,
) => {
  ctx.set({
    'X-Authlib-Injector-API-Location': '/api/yggdrasil',
  });
  await next();
};
