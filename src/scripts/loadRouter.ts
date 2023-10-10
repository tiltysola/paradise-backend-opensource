import fs from 'fs';
import { Logger } from 'futo-utils';
import Koa from 'koa';
import Router from 'koa-router';
import path from 'path';

interface ClassObj {
  method: Method;
  middleware?: Koa.Middleware;
  customPath?: string;
  run: Function;
}

type Method = 'get' | 'post' | 'all';

const controllerPrefix = '/api';

const deepPath = (_path: string, _source?: string): string[] => {
  const _controllers: any[] = [];
  if (fs.existsSync(_path)) {
    const files = fs.readdirSync(_path);
    for (const file of files) {
      if (fs.lstatSync(path.join(_path, file)).isDirectory()) {
        _controllers.push(...deepPath(path.join(_path, file), _source || _path));
      } else {
        const relativePath = path.join(_path, file).replace(_source || _path, '');
        if (/^.*\.[tj]s$/i.test(relativePath)) {
          const match = relativePath.match(/^(.*)\.[tj]s$/i);
          if (match) {
            _controllers.push(match[1]);
          }
        }
      }
    }
  }
  return _controllers;
};

export default async (self: Router, _path: string) => {
  const controllers = deepPath(_path);
  for (const controller of controllers) {
    const controllerPath = `${controllerPrefix}${controller}`;
    const controllerObject = require(path.join(_path, controller)).default;
    const { method, middleware, customPath, run }: ClassObj = controllerObject;
    if (method && run) {
      Logger.info('[Loader]', 'Register controller:', customPath || controllerPath, method.toUpperCase());
      if (middleware) {
        self[method](customPath || controllerPath, middleware, async (ctx: any) => {
          await run(ctx);
        });
      } else {
        self[method](customPath || controllerPath, async (ctx: any) => {
          await run(ctx);
        });
      }
    }
  }
};
