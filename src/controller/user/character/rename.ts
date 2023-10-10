import { isString, regexp } from 'futo-utils';
import Koa from 'koa';

import characterService from '@/service/paradise/character';

import userMiddleware from '@/middleware/passport/user';

import { extraCodeParadise } from '@/utils/errorCodeList';

export default class {
  static method = 'post';
  static middleware = userMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { charId, nickname } = ctx.request.body;
    if (!isString(charId) || !regexp.uuid.test(charId)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_CHARID);
    } else if (nickname && !regexp.username.test(nickname)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_NICKNAME);
    } else if (!await characterService.exist({ uuid: charId })) {
      ctx.body = ctx.code('CHARACTER_NOT_EXIST');
    } else {
      const character = await characterService.getCharacter({ uuid: charId });
      const userId = character?.getDataValue('userId');
      if (userId !== ctx.userId) {
        ctx.body = ctx.code('CHARACTER_NOT_BELONG_TO_YOU');
      } else if (await characterService.exist({ nickname })) {
        ctx.body = ctx.code('NICKNAME_EXIST');
      } else {
        await characterService.modify({ uuid: charId }, { nickname });
        ctx.body = ctx.code('SUCCESS');
      }
    }
  }
}
