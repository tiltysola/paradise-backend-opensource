import { isString, regexp } from 'futo-utils';
import Koa from 'koa';

import textureService from '@/service/paradise/texture';

import userMiddleware from '@/middleware/passport/user';

import { extraCodeParadise } from '@/utils/errorCodeList';

export default class {
  static method = 'post';
  static middleware = userMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { textId, share } = ctx.request.body;
    if (!isString(textId) || !regexp.uuid.test(textId)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_TEXTID);
    } else if (!(typeof share === 'boolean')) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_SHARE);
    } else if (!await textureService.exist({ uuid: textId })) {
      ctx.body = ctx.code('TEXTURE_NOT_EXIST');
    } else {
      const texture = await textureService.getTexture({ uuid: textId });
      const userIdText = texture?.getDataValue('userId');
      if (userIdText !== ctx.userId) {
        ctx.body = ctx.code('TEXTURE_NOT_BELONG_TO_YOU');
      } else {
        await textureService.shareById(textId, share);
        ctx.body = ctx.code('SUCCESS');
      }
    }
  }
}
