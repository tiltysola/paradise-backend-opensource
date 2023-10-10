import { isString, limitNumber } from 'futo-utils';
import Koa from 'koa';

import userService from '@/service/passport/user';

import adminMiddleware from '@/middleware/passport/admin';

import { extraCodePassport } from '@/utils/errorCodeList';

export default class {
  static method = 'get';
  static middleware = adminMiddleware;
  static async run(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    const { page: _page, pageSize: _pageSize } = ctx.request.query;
    if (
      (_page && !isString(_page)) ||
      (_pageSize && !isString(_pageSize))
    ) {
      ctx.body = ctx.code('FIELD_VALIDATE_ERROR', extraCodePassport.EXTRA_PAGE_SIZE);
    } else {
      const page = !isNaN(_page as any) ? limitNumber(_page, 1) : 1;
      const pageSize = !isNaN(_pageSize as any) ? limitNumber(_pageSize, 1, 100) : 20;
      const userList = await userService.getAllList({
        page: page || undefined,
        pageSize: pageSize || undefined,
      });
      const userListObject: any = userList.map((v) => {
        const item: any = v.toJSON();
        delete item.password;
        return item;
      });
      ctx.body = ctx.code('SUCCESS', {
        list: userListObject,
        total: await userService.getAllListCount(),
      });
    }
  }
}
