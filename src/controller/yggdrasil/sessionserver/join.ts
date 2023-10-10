import { regexp } from 'futo-utils';
import Koa from 'koa';

import characterService from '@/service/paradise/character';
import yggdrasilService from '@/service/paradise/yggdrasil';
import userService from '@/service/passport/user';

import { extraCodeParadise } from '@/utils/errorCodeList';

export default class {
  static method = 'post';
  static customPath = '/api/yggdrasil/sessionserver/session/minecraft/join';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { accessToken, selectedProfile, serverId } = ctx.request.body;
    const ip = (ctx.request.header['x-forwarded-for'] || ctx.request.ip) as string;
    if (!regexp.uuid.test(accessToken)) {
      ctx.status = 403;
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_ACCESSTOKEN);
    } else {
      const userId = await yggdrasilService.getUserId(accessToken);
      if (!userId) {
        ctx.status = 403;
        ctx.body = ctx.code('ACCESS_TOKEN_NOT_FOUND');
      } else {
        const user = await userService.getUser({ uuid: userId });
        if (!user) {
          ctx.status = 403;
          ctx.body = ctx.code('USER_NOT_FOUND');
        } else {
          const banned = user.getDataValue('banned');
          if (banned) {
            ctx.body = ctx.code('USER_BANNED', {
              errorMessage: `账户被封禁，理由：${user.getDataValue('banReason')}`,
            });
          } else {
            const character = await characterService.getCharacter({ uuid: selectedProfile });
            if (character?.getDataValue('userId') !== userId) {
              ctx.status = 403;
              ctx.body = ctx.code('CHARACTER_NOT_BELONG_TO_YOU');
            } else {
              await yggdrasilService.createServerJoin({
                accessToken,
                serverId,
                selectedProfile,
                ip,
              });
              ctx.status = 204;
            }
          }
        }
      }
    }
  }
}
