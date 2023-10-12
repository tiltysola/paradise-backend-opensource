import { isString, regexp, uuid } from 'futo-utils';
import Koa from 'koa';

import characterService from '@/service/paradise/character';

import userMiddleware from '@/middleware/passport/user';

import { extraCodeParadise } from '@/utils/errorCodeList';
import extraRegexp from '@/utils/extraRegexp';

import config from '@/config/general';

export default class {
  static method = 'post';
  static middleware = userMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { nickname, skinType } = ctx.request.body;
    if (!isString(nickname) || !regexp.username.test(nickname)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_NICKNAME);
    } else if (!extraRegexp.type(skinType)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_SKINTYPE);
    } else {
      const characterCount = await characterService.getUserListCount(ctx.userId);
      if (characterCount >= config.character.maxCharacters) {
        ctx.body = ctx.code('CHARACTER_COUNT_LIMIT_ERROR');
      } else if (await characterService.exist({ nickname })) {
        ctx.body = ctx.code('NICKNAME_EXIST');
      } else {
        const character = await characterService.create({
          uuid: uuid(),
          userId: ctx.userId,
          nickname,
          skinType,
        });
        if (!character) {
          ctx.body = ctx.code('INTERNAL_ERROR');
        } else {
          ctx.body = ctx.code('SUCCESS');
        }
      }
    }
  }
}
