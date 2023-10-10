import fs from 'fs';
import Koa from 'koa';
import path from 'path';

export default class {
  static method = 'get';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { userId, uuid, type } = ctx.query;
    const filename = `uploads/paradise/textures/${userId}/${type}/${uuid}.png`;
    ctx.set('content-type', 'image/png');
    ctx.body = fs.readFileSync(path.join(process.cwd(), 'cache', filename));
  }
}
