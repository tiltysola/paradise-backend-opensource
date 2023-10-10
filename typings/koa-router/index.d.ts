import { code } from 'futo-utils';
import type { CodeFunc } from 'futo-utils';

import errorCodeList from '@/utils/errorCodeList';

type ErrorCodeList = typeof errorCodeList;
type ErrorCodeListEnum = keyof ErrorCodeList;

declare module 'koa-router' {
  interface IRouterParamContext {
    code: CodeFunc<ErrorCodeListEnum>;
    file: multer.File;
    files: multer.File[];
  }
}
