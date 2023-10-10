import Koa from 'koa';

import characterService from '@/service/paradise/character';
import yggdrasilService from '@/service/paradise/yggdrasil';

export default class {
  static method = 'get';
  static customPath = '/api/yggdrasil/sessionserver/session/minecraft/profile/:uuid';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { unsigned = true } = ctx.request.query;
    const { uuid } = ctx.params;
    const character = await characterService.getCharacter({ uuid });
    if (!character) {
      ctx.status = 204;
    } else {
      ctx.body = await yggdrasilService.getProfileObjectById(uuid, unsigned === 'false');
    }
  }
}
