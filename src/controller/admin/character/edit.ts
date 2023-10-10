import { isString, regexp } from 'futo-utils';
import Koa from 'koa';

import characterService from '@/service/paradise/character';

import adminMiddleware from '@/middleware/passport/admin';

import { extraCodeParadise } from '@/utils/errorCodeList';
import extraRegexp from '@/utils/extraRegexp';

export default class {
  static method = 'post';
  static middleware = adminMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { charId, nickname, skin, skinType, cape, operator } = ctx.request.body;
    if (!isString(charId) || !regexp.uuid.test(charId)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_CHARID);
    } else if (nickname && !regexp.username.test(nickname)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_NICKNAME);
    } else if (skin && !regexp.uuid.test(skin)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_SKIN);
    } else if (!extraRegexp.type(skinType)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_SKINTYPE);
    } else if (cape && !regexp.uuid.test(cape)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_CAPE);
    } else if (typeof operator !== 'boolean') {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_OPERATOR);
    } else if (await characterService.exist({ uuid: charId })) {
      await characterService.modify({
        uuid: charId,
      }, {
        nickname,
        skin,
        skinType,
        cape,
        operator,
      });
      ctx.body = ctx.code('SUCCESS');
    } else {
      ctx.body = ctx.code('CHARACTER_NOT_EXIST');
    }
  }
}
