import fs from 'fs';
import { Logger, uuid } from 'futo-utils';
import Koa from 'koa';
import path from 'path';

import textureService from '@/service/paradise/texture';

import userMiddleware from '@/middleware/passport/user';

import { extraCodeParadise } from '@/utils/errorCodeList';
import extraRegexp from '@/utils/extraRegexp';

import config from '@/config/paradise';

export default class {
  static method = 'post';
  static middleware = userMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { type } = ctx.request.body;
    const file = ctx.files && (ctx.files as any)[0];
    if (!extraRegexp.type(type)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_TYPE);
    } else if (!file || (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg')) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_FILE);
    } else if (!await textureService.checkImageSize(file.path, Number(type))) {
      ctx.body = ctx.code('FILE_TYPE_ERROR');
    } else {
      const textureCount = await textureService.getUserListCount(ctx.userId, type);
      if (
        (Number(type) === 0 && textureCount < config.texture.maxSkins) ||
          (Number(type) === 1 && textureCount < config.texture.maxCapes)
      ) {
        const textId = uuid();
        const filename = `uploads/paradise/textures/${ctx.userId}/${Number(type) === 0 ? 'skin' : 'cape'}/${textId}.png`;
        const hash = await textureService.computeTextureHash(file.path);
        try {
          if (!fs.existsSync(path.dirname(path.join(process.cwd(), 'cache', filename)))) fs.mkdirSync(path.dirname(path.join(process.cwd(), 'cache', filename)), { recursive: true });
          fs.copyFileSync(file.path, path.join(process.cwd(), 'cache', filename));
          const texture = await textureService.create({
            uuid: textId,
            userId: ctx.userId,
            hash,
            type,
          });
          if (!texture) {
            ctx.body = ctx.code('INTERNAL_ERROR');
          } else {
            ctx.body = ctx.code('SUCCESS');
          }
        } catch (err) {
          Logger.critical('[AddTexture]', err);
          ctx.body = ctx.code('INTERNAL_ERROR');
        }
      } else {
        ctx.body = ctx.code('TEXTURE_COUNT_LIMIT_ERROR');
      }
    }
  }
}
