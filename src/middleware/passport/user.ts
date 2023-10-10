import Koa from 'koa';

export default async (
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
  next: Koa.Next,
) => {
  if (ctx.userId) {
    await next();
  } else {
    ctx.body = ctx.code('USER_NOT_LOGIN');
  }
};
