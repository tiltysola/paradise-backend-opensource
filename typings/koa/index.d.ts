import { code } from 'futo-utils';
import type { CodeFunc } from 'futo-utils';

import errorCodeList from '@/utils/errorCodeList';

type ErrorCodeList = typeof errorCodeList;
type ErrorCodeListEnum = keyof ErrorCodeList;

declare module 'koa' {
  interface DefaultContext {
    code: CodeFunc<ErrorCodeListEnum>;
  }
}
