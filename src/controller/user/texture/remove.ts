import { isString, regexp } from 'futo-utils';
import Koa from 'koa';

import textureService from '@/service/paradise/texture';

import userMiddleware from '@/middleware/passport/user';

import { extraCodeParadise } from '@/utils/errorCodeList';

export default class {
  static method = 'post';
  static middleware = userMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { textId } = ctx.request.body;
    if (!isString(textId) || !regexp.uuid.test(textId)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_TEXTID);
    } else if (await textureService.exist({ uuid: textId })) {
      const texture = await textureService.getTexture({ uuid: textId });
      const userId = texture?.getDataValue('userId');
      if (userId === ctx.userId) {
        await textureService.invalid(textId);
        ctx.body = ctx.code('SUCCESS');
      } else {
        ctx.body = ctx.code('TEXTURE_NOT_BELONG_TO_YOU');
      }
    } else {
      ctx.body = ctx.code('TEXTURE_NOT_EXIST');
    }
  }
}
