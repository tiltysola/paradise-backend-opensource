import { isString, regexp } from 'futo-utils';
import Koa from 'koa';

import characterService from '@/service/paradise/character';
import yggdrasilService from '@/service/paradise/yggdrasil';

export default class {
  static method = 'get';
  static customPath = '/api/yggdrasil/sessionserver/session/minecraft/hasJoined';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { username, serverId } = ctx.request.query;
    if (
      !isString(username) ||
      !isString(serverId) ||
      !regexp.username.test(username)
    ) {
      ctx.status = 204;
    } else {
      const join = await yggdrasilService.getJoinById(serverId);
      const charId = join?.getDataValue('selectedProfile');
      const character = await characterService.getCharacter({ uuid: charId });
      if (character?.getDataValue('nickname') === username) {
        ctx.body = await yggdrasilService.getProfileObjectById(charId);
      }
    }
  }
}
