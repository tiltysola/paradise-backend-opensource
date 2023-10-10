import { isString, regexp, uuid } from 'futo-utils';
import Koa from 'koa';

import yggdrasilService from '@/service/paradise/yggdrasil';

import { extraCodeParadise } from '@/utils/errorCodeList';

export default class {
  static method = 'post';
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const {
      accessToken: aToken,
      clientToken: ctoken,
      requestUser,
      selectedProfile,
    } = ctx.request.body;
    if (!isString(aToken) || !regexp.uuid.test(aToken)) {
      ctx.status = 403;
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodeParadise.EXTRA_FIELD_ACCESSTOKEN);
    } else {
      const userId = await yggdrasilService.getUserId(aToken);
      const clientToken = await yggdrasilService.getClientToken(aToken);
      if (!userId) {
        ctx.status = 403;
        ctx.body = ctx.code('ACCESS_TOKEN_NOT_FOUND');
      } else if (ctoken && ctoken !== clientToken) {
        ctx.status = 403;
        ctx.body = ctx.code('CLIENT_TOKEN_NOT_MATCH');
      } else {
        const accessToken = uuid();
        await yggdrasilService.create({
          userId,
          accessToken,
          clientToken,
          selectedProfile: selectedProfile?.id,
        });
        const data: any = {
          accessToken,
          clientToken,
        };
        if (selectedProfile?.id) {
          data.selectedProfile = await yggdrasilService.getProfileObjectById(selectedProfile.id);
        }
        if (requestUser) {
          data.user = await yggdrasilService.getUserObjectById(userId);
        }
        ctx.body = data;
      }
    }
  }
}
