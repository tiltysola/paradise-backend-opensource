import { isString, regexp, uuid } from 'futo-utils';
import Koa from 'koa';

import characterService from '@/service/paradise/character';
import yggdrasilService from '@/service/paradise/yggdrasil';
import attemptService from '@/service/passport/attempt';
import userService from '@/service/passport/user';

import { extraCodeParadise } from '@/utils/errorCodeList';

import config from '@/config/general';

export default class {
  static method = 'post';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const {
      username,
      password,
      clientToken: cToken,
      requestUser,
      // agent,
    } = ctx.request.body;
    if (!isString(username) || !regexp.email.test(username)) {
      ctx.status = 403;
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_USERNAME);
    } else if (!isString(password)) {
      ctx.status = 403;
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_PASSWORD);
    } else {
      const user = await userService.getUser({ email: username });
      if (!user) {
        ctx.status = 403;
        ctx.body = ctx.code('USER_NOT_FOUND');
      } else {
        const userId = user.getDataValue('uuid');
        const banned = user.getDataValue('banned');
        if (banned) {
          ctx.body = ctx.code('USER_BANNED', {
            errorMessage: `账户被封禁，理由：${user.getDataValue('banReason')}`,
          });
        } else {
          const attemptCount = await attemptService.getAttempt(userId, false, 'YGGDRASIL');
          if (attemptCount >= config.attempt.maxTimes) {
            ctx.status = 403;
            ctx.body = ctx.code('USER_ATTEMPT_LIMIT_ERROR');
          } else {
            const success = !!(await userService.validate({ email: username }, password));
            attemptService.create(userId, success, 'YGGDRASIL');
            if (!success) {
              ctx.status = 403;
              ctx.body = ctx.code('USER_PASSWORD_ERROR');
            } else {
              const clientToken = cToken || uuid();
              const accessToken = uuid();
              await yggdrasilService.create({
                userId,
                accessToken,
                clientToken,
              });
              const userProfiles = (await characterService.getUserList(userId)).map((v) => {
                return new Promise((resolve, reject) => {
                  const charId = v.getDataValue('uuid');
                  yggdrasilService.getProfileObjectById(charId).then((profile) => {
                    resolve(profile);
                  }).catch((e) => {
                    reject(e);
                  });
                });
              });
              const availableProfiles = await Promise.all(userProfiles);
              const data: any = {
                accessToken,
                clientToken,
                availableProfiles,
                selectedProfile: availableProfiles.length === 1 ? availableProfiles[0] : null,
              };
              if (requestUser) {
                data.user = await yggdrasilService.getUserObjectById(userId);
              }
              ctx.body = data;
            }
          }
        }
      }
    }
  }
}
