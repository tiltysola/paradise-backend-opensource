import { isString, regexp } from 'futo-utils';
import Koa from 'koa';

import characterService from '@/service/paradise/character';
import textureService from '@/service/paradise/texture';

import userMiddleware from '@/middleware/passport/user';

import { extraCodeParadise } from '@/utils/errorCodeList';
import extraRegexp from '@/utils/extraRegexp';

export default class {
  static method = 'post';
  static middleware = userMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { charId, textId, type } = ctx.request.body;
    if (!isString(charId) || !regexp.uuid.test(charId)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_CHARID);
    } else if (isString(textId) && !regexp.uuid.test(textId)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_TEXTID);
    } else if (!extraRegexp.type(type)) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_TYPE);
    } else if (!await characterService.exist({ uuid: charId })) {
      ctx.body = ctx.code('CHARACTER_NOT_EXIST');
    } else {
      const character = await characterService.getCharacter({ uuid: charId });
      const userIdChar = character?.getDataValue('userId');
      if (userIdChar !== ctx.userId) {
        ctx.body = ctx.code('CHARACTER_NOT_BELONG_TO_YOU');
      } else if (textId === null) {
        if (Number(type) === 0) {
          await characterService.modify({
            uuid: charId,
          }, {
            skin: textId,
          });
        } else {
          await characterService.modify({
            uuid: charId,
          }, {
            cape: textId,
          });
        }
        ctx.body = ctx.code('SUCCESS');
      } else if (await textureService.exist({ uuid: textId })) {
        const texture = await textureService.getTexture({ uuid: textId });
        const textureType = texture?.getDataValue('type');
        if (textureType !== type) {
          ctx.body = ctx.code('TEXTURE_TYPE_ERROR');
        } else {
          const userIdText = texture?.getDataValue('userId');
          const isShare = texture?.getDataValue('share');
          if (isShare !== 1 && userIdText !== ctx.userId) {
            ctx.body = ctx.code('TEXTURE_NOT_BELONG_TO_YOU');
          } else {
            if (Number(type) === 0) {
              await characterService.modify({
                uuid: charId,
              }, {
                skin: textId,
              });
            } else {
              await characterService.modify({
                uuid: charId,
              }, {
                cape: textId,
              });
            }
            ctx.body = ctx.code('SUCCESS');
          }
        }
      } else {
        ctx.body = ctx.code('TEXTURE_NOT_EXIST');
      }
    }
  }
}
