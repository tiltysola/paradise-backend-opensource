import fs from 'fs';
import Koa from 'koa';
import path from 'path';

export default class {
  static method = 'get';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { userId, avatar } = ctx.query;
    const filename = `uploads/passport/users/avatar/${userId}/${avatar}`;
    ctx.set('content-type', 'image/png');
    ctx.body = fs.readFileSync(path.join(process.cwd(), 'cache', filename));
  }
}
