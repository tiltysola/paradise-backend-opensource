import fs from 'fs';
import { Logger } from 'futo-utils';
import Router from 'koa-router';
import path from 'path';

import loadRouter from '@/scripts/loadRouter';

class RouterHelper extends Router {
  constructor() {
    super();
    loadRouter(this, path.join(__dirname, '../controller'));
    this.get(['/', '/(.*)'], async (ctx) => {
      try {
        ctx.set('content-type', 'text/html');
        ctx.body = fs.readFileSync(path.join(process.cwd(), './public/paradise.html'));
      } catch (err) {
        Logger.critical('[Router]', err);
        ctx.body = ctx.code('PAGE_NOT_FOUND');
      }
    });
    this.all(['/', '/(.*)'], async (ctx) => {
      ctx.body = ctx.code('METHOD_NOT_FOUND');
    });
  }
}

export default new RouterHelper();
