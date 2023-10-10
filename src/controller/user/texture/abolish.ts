import { isString, regexp } from 'futo-utils';
import Koa from 'koa';

import characterService from '@/service/paradise/character';

import userMiddleware from '@/middleware/passport/user';

import { extraCodeParadise } from '@/utils/errorCodeList';
import extraRegexp from '@/utils/extraRegexp';

export default class {
  static method = 'post';
  static middleware = userMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { charId, type } = ctx.request.body;
    if (!isString(charId) || !regexp.uuid.test(charId)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_CHARID);
    } else if (!extraRegexp.type(type)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_TYPE);
    } else if (await characterService.exist({ uuid: charId })) {
      ctx.body = ctx.code('CHARACTER_NOT_EXIST');
    } else {
      const character = await characterService.getCharacter({ uuid: charId });
      const userIdChar = character?.getDataValue('userId');
      if (userIdChar !== ctx.userId) {
        ctx.body = ctx.code('CHARACTER_NOT_BELONG_TO_YOU');
      } else {
        if (Number(type) === 0) {
          await characterService.modify({
            uuid: charId,
          }, {
            skin: null,
          });
        } else {
          await characterService.modify({
            uuid: charId,
          }, {
            cape: null,
          });
        }
        ctx.body = ctx.code('SUCCESS');
      }
    }
  }
}
