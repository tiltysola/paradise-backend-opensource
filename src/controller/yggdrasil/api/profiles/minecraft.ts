import Koa from 'koa';

import characterService from '@/service/paradise/character';
import yggdrasilService from '@/service/paradise/yggdrasil';

export default class {
  static method = 'post';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const nicknames = ctx.request.body;
    if (typeof nicknames !== 'object') {
      ctx.status = 204;
    } else {
      const profiles = (await Promise.all(nicknames.map((nickname: any) => {
        return new Promise((resolve, reject) => {
          characterService.getCharacter({ nickname }).then((character) => {
            if (character) {
              const charId = character?.getDataValue('uuid');
              yggdrasilService.getProfileObjectById(charId).then((profile) => {
                resolve(profile);
              }).catch((e) => {
                reject(e);
              });
            } else {
              resolve(null);
            }
          }).catch((e) => {
            reject(e);
          });
        });
      }))).filter((v) => !!v);
      ctx.body = profiles;
    }
  }
}
