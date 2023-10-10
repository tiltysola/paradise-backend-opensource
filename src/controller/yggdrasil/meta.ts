import Koa from 'koa';

import { getPublicKey } from '@/utils/validateCertification';

import config from '@/config/paradise';

export default class {
  static method = 'get';
  static customPath = '/api/yggdrasil';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    ctx.body = {
      meta: {
        implementationName: 'paradise-opensource',
        implementationVersion: '1.0.0',
        serverName: config.serverName,
        links: {
          homepage: config.links?.homepage,
          register: config.links?.register,
        },
      },
      skinDomains: [config.host.replace(/^.*\/\/|\/.*$/g, ''), ...config.skinDomains],
      signaturePublickey: getPublicKey(),
    };
  }
}
