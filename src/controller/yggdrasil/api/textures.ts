import fs from 'fs';
import Koa from 'koa';
import path from 'path';

import textureService from '@/service/paradise/texture';

export default class {
  static method = 'get';
  static customPath = '/api/yggdrasil/textures/:hash';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { hash } = ctx.params;
    const texture = await textureService.getTexture({ hash });
    if (!texture) {
      ctx.status = 204;
    } else {
      const uuid = texture.getDataValue('uuid');
      const userId = texture.getDataValue('userId');
      const type = texture.getDataValue('type') === 0 ? 'skin' : 'cape';
      const filename = `uploads/paradise/textures/${userId}/${type}/${uuid}.png`;
      ctx.set('content-type', 'image/png');
      ctx.body = fs.readFileSync(path.join(process.cwd(), 'cache', filename));
    }
  }
}
