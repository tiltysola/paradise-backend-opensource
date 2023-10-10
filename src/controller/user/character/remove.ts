import { isString, regexp } from 'futo-utils';
import Koa from 'koa';

import characterService from '@/service/paradise/character';

import userMiddleware from '@/middleware/passport/user';

import { extraCodeParadise } from '@/utils/errorCodeList';

export default class {
  static method = 'post';
  static middleware = userMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { charId } = ctx.request.body;
    if (!isString(charId) || !regexp.uuid.test(charId)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_CHARID);
    } else if (!await characterService.exist({ uuid: charId })) {
      ctx.body = ctx.code('CHARACTER_NOT_EXIST');
    } else {
      const character = await characterService.getCharacter({
        uuid: charId,
      });
      const userId = character?.getDataValue('userId');
      if (userId !== ctx.userId) {
        ctx.body = ctx.code('CHARACTER_NOT_BELONG_TO_YOU');
      } else {
        await characterService.invalid(charId);
        ctx.body = ctx.code('SUCCESS');
      }
    }
  }
}
