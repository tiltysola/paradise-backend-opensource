import { isString, regexp } from 'futo-utils';
import Koa from 'koa';

import characterService from '@/service/paradise/character';

import adminMiddleware from '@/middleware/passport/admin';

import { extraCodeParadise } from '@/utils/errorCodeList';

export default class {
  static method = 'get';
  static middleware = adminMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { charId } = ctx.request.query;
    if (!isString(charId) || !regexp.uuid.test(charId)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_CHARID);
    } else {
      const character = await characterService.getCharacter({ uuid: charId });
      ctx.body = ctx.code('SUCCESS', character);
    }
  }
}
