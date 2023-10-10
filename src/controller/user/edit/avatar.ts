import fs from 'fs';
import { uuid } from 'futo-utils';
import Koa from 'koa';
import path from 'path';

import userService from '@/service/passport/user';

import userMiddleware from '@/middleware/passport/user';

import { extraCodePassport } from '@/utils/errorCodeList';

export default class {
  static method = 'post';
  static middleware = userMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const file = ctx.files && (ctx.files as any)[0];
    if (!file || (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg')) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_FIELD_AVATAR);
    } else {
      const avatarId = uuid();
      const filename = `uploads/passport/users/avatar/${ctx.userId}/${avatarId}.${file.mimetype.split('/')[1]}`;
      if (!fs.existsSync(path.join(process.cwd(), 'cache', filename))) fs.mkdirSync(path.join(process.cwd(), 'cache', filename));
      fs.copyFileSync(file.path, path.join(process.cwd(), 'cache', filename));
      await userService.modify({
        uuid: ctx.userId,
      }, {
        avatar: `${avatarId}.${file.mimetype.split('/')[1]}`,
      });
      ctx.body = ctx.code('SUCCESS');
    }
  }
}
