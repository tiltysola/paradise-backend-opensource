import Koa from 'koa';

import { getPublicKey } from '@/utils/validateCertification';

import config from '@/config/general';

export default class {
  static method = 'get';
  static customPath = '/api/yggdrasil';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    ctx.body = {
      meta: {
        implementationName: 'paradise-opensource',
        implementationVersion: '1.0.0',
        serverName: config.siteName,
        links: {
          homepage: config.gate,
          register: `${config.gate}/register`,
        },
      },
      skinDomains: [config.gate.replace(/^.*\/\/|\/.*$/g, '')],
      signaturePublickey: getPublicKey(),
    };
  }
}
